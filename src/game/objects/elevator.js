//@ts-check
import Object2D, {Type} from './object2d';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';
import Player from './player';

let sign = i => i===0?1:-1;

const WALL_THICKNESS = 0.075;//relative to elevator's height and weight
const ACTIVATION_DISTANCE = 0.3**2;//minimum squared distance
const ELEVATOR_RIDE_TIME = 3000;//how much time does the elevator takes to travel
const ELEVATOR_RIDE_DISTANCE = 1.5;//how far the elevator travels

export default class Elevator extends Object2D {
	/**
	 * @param {number} w
	 * @param {number} h
	 * @param {SvgEngine} graphics_engine
	 * @param {SimplePhysics} physics_engine
	 * @param {Object2D[]} objects handle for objects array that are part of map
	 */
	constructor(w, h, graphics_engine, physics_engine, objects) {
		super(Type.RECT, w, h, graphics_engine, physics_engine, 2);
		this.objects = objects;
		this.body.setMask(0);
		
		this.walls = [null, null].map((wall, i) =>
			new Object2D(Type.RECT, w+h*WALL_THICKNESS, h*WALL_THICKNESS, graphics_engine,physics_engine)
				.setClass('orange').setStatic());
		objects.push(...this.walls);

		this.doors = [null, null].map((wall, i) =>
			new Object2D(Type.RECT, w*WALL_THICKNESS, h+w*WALL_THICKNESS, graphics_engine,physics_engine)
				.setClass('orange_transparent').setStatic());
		objects.push(...this.doors);

		this.doors.forEach(d => {//init doors with no collisions
			d.body.setMask(0);
			d.editable = false;
		});

		this.walls.forEach(w => w.editable = false);

		this.locked = 0;
		/** @type {Player} player instance handle */
		this.player = null;
		this.dir = -1;//1 - up, -1 - down
		this.activated = false;
		this.time_to_destination = ELEVATOR_RIDE_TIME;
		/** @type {{x: number, y: number}} point from which the elevator start traveling */
		this.starting_point = null;
		this.isOpen = true;
	}

	/** @param {SimplePhysics} physics_engine */
	_destroy_(physics_engine) {
		for(let obj of [...this.walls, ...this.doors])
			obj.to_destroy = true;
		super._destroy_(physics_engine);
	}

	onPlayerEnter(player) {
		if(this.player !== null)//player already inside
			return;
		if(this.locked > 0) {//elevator not yet unlocked
			this.locked = Math.min(10, this.locked+2);
			return;
		}

		this.player = player;
	}

	/**
	* @param {number} x
	* @param {number} y
	* @param {number} rot
	*/
	updatePositions(x, y, rot) {
		let offset = this.transform.h;
		let cos = Math.cos(rot + Math.PI/2);
		let sin = Math.sin(rot + Math.PI/2);
		this.walls.forEach( (w, i) => {
			w.setRot(rot);
			w.setPos(x + cos * offset * sign(i), y + sin * offset * sign(i));
		});
		cos = Math.cos(rot);
		sin = Math.sin(rot);
		this.doors.forEach( (d, i) => {
			d.setRot(rot);
			d.setPos(x + cos * offset * sign(i), y + sin * offset * sign(i));
		});
	}

	/**
	* @param {number} x
	* @param {number} y
	*/
	setPos(x, y) {
		this.updatePositions(x, y, this.getTransform().rot);
		return super.setPos(x, y);
	}

	/**
	* @param {number} rot
	*/
	setRot(rot) {
		this.updatePositions(this.getTransform().x, this.getTransform().y, rot);
		return super.setRot(rot);
	}

	toogleDoor() {
		if(!this.isOpen) {
			this.doors.forEach(d => d.setClass('orange_transparent').body.setMask(0));//open
		} else {
			this.doors.forEach(d => d.setClass('orange').body.setMask(~0));//close
		}
		this.isOpen = !this.isOpen;
	}

	/**
	 * @param  {number?} dt
	 * @param  {boolean?} paused
	 */
	update(dt, paused = false) {
		if(this.player) {
			const dst = Math.pow(this.player.getTransform().x - this.getTransform().x, 2) +
			Math.pow(this.player.getTransform().y - this.getTransform().y, 2);

			if(this.activated) {
				if((this.time_to_destination-=dt) <= 0) {
					this.player = null;
					this.activated = false;
					//this.removeClass(this.dir === 1 ? 'elevator_up' : 'elevator_down');
					this.toogleDoor();
				}
				else {
					let dst = ELEVATOR_RIDE_DISTANCE *
						Math.pow(1 - this.time_to_destination/ELEVATOR_RIDE_TIME, 2);
					let rot = this.getTransform().rot - Math.PI/2;
					this.setPos(
						this.starting_point.x + Math.cos(rot) * dst * this.dir,
						this.starting_point.y + Math.sin(rot) * dst * this.dir,
					);

					let dx = this.getTransform().x - this.player.getTransform().x;
					let dy = this.getTransform().y - this.player.getTransform().y;
					this.player.setPos(
						this.player.getTransform().x + dx * dt * 0.006,
						this.player.getTransform().y + dy * dt * 0.006
					);
					this.player.body.velocity.set(0, 0);
				}
			}
			else if(dst > this.transform.w*this.transform.h) {//player leaved elevator
				this.player = null;
				this.activated = false;
			}
			else if(dst <= ACTIVATION_DISTANCE) {
				this.activated = true;
				this.starting_point = {x: this.getTransform().x, y: this.getTransform().y};
				this.time_to_destination = ELEVATOR_RIDE_TIME;
				this.dir = -this.dir;//revert direction
				this.toogleDoor();
				//this.addClass(this.dir === 1 ? 'elevator_up' : 'elevator_down');
			}
		}
		else if(this.locked > 0)
			this.locked--;

		super.update(dt, paused);
	}
}
