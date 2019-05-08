//@ts-check
import Object2D, {Type} from './object2d';
// import CollisionCategories from './collision_categories';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';
import {OBJECTS} from './../predefined_assets';
import Key from './key';

const OPENING_TIME = 1000 * 3;

export default class Door extends Object2D {
	/**
	* @param {number} w
	* @param {number} h
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	* @param {number} type type of this door
	* @param {Object2D[]} objects handle for objects array that are part of map
	*/
	constructor(w, h, graphics_engine, physics_engine, type, objects) {
		console.log();
		super(Type.RECT, w, h, graphics_engine, physics_engine);

		//for adding door parts
		this.objects = objects;
		this._graphics = graphics_engine;
		this._physics = physics_engine;

		this.door_type = type;//TODO - make use of it when more doors will be created

		this.initialH = h;

		/** @type  {Key} */
		this.key = null;
		/** @type {(Object2D | null)[]} */
		this.parts = [null, null];
		this.opening_time = OPENING_TIME;
	}

	/**
	 * @param  {Key} key
	 */
	open(key) {
		if(this.key)
			return;
		this.key = key;
		console.log('opening doors of type:', this.door_type);
		//make ghost object
		key.body.setMask(0);
		key.body.velocity.set(0, 0);
		key.body.static = true;

		this.body.setMask(0);

		//split door object
		let w = this.getTransform().w;
		let h = this.getTransform().h;
		let rot = this.getTransform().rot;

		this.parts = [
			new Object2D(Type.RECT, w, h/2, this._graphics, this._physics),
			new Object2D(Type.RECT, w, h/2, this._graphics, this._physics)
		];

		this.parts.forEach((part, i) => {
			this.parts[i].setPos(
				this.getTransform().x + Math.cos(rot+Math.PI/2) * h/2 * (i === 0 ? 1 : -1),
				this.getTransform().y + Math.sin(rot+Math.PI/2) * h/2 * (i === 0 ? 1 : -1)
			);

			part.setRot(rot);
			part.setClass(this.getClassName());
			part.body.setMask(0);
			part.setStatic();

			this.objects.push(part);
		});

		this.setSize(0, 0);
	}

	/** @param {number} dt */
	update(dt) {
		if(this.key !== null) {//opening door
			let dx = this.getTransform().x - this.key.getTransform().x;
			let dy = this.getTransform().y - this.key.getTransform().y;
			this.key.setPos(
				this.key.getTransform().x + dx * 0.03,
				this.key.getTransform().y + dy * 0.03
			);

			if((this.opening_time-=dt) <= 0) {
				this.parts.forEach(part => part.to_destroy = true);
				this.to_destroy = true;
				this.key.to_destroy = true;
			}
			else {
				//opening animation
				let factor = Math.pow(this.opening_time / OPENING_TIME, 4);
				let rot = this.getTransform().rot;
				let offH = this.initialH/2 * (1-factor + 1);
				this.parts.forEach((part, i) => {
					let px = this.getTransform().x + Math.cos(rot+Math.PI/2) * offH * (i === 0 ? 1 : -1);
					let py = this.getTransform().y + Math.sin(rot+Math.PI/2) * offH * (i === 0 ? 1 : -1);
					this.parts[i].setPos(px, py);

					this.parts[i].setSize(
						this.parts[i].getTransform().w,
						this.initialH/2 * factor
					);
				});
				let key_scale = OBJECTS.key1.radius * factor;
				this.key.setSize(key_scale, key_scale);
			}
		}
		super.update(dt);
	}
}
