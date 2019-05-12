//@ts-check
import Object2D, {Type} from './object2d';
import CollisionCategories from './collision_categories';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';
import EnemySensor from './enemy_sensor';
import Player from './player';

const SENSOR_RADIUS = 2.5;//how far does the enemy sees
const ENEMY_SPEED = 0.25;//

function shortAngleDist(a0, a1) {
    var max = Math.PI*2;
    var da = (a1 - a0) % max;
    return 2*da % max - da;
}

function angleLerp(a0, a1, t) {
    return a0 + shortAngleDist(a0,a1)*t;
}

export default class Enemy extends Object2D {
	/**
	* @param {number} w
	* @param {number} h
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	*/
	constructor(w, h, graphics_engine, physics_engine) {
		super(Type.CIRCLE, w, h, graphics_engine, physics_engine, 2);
		this.body.setCategory(CollisionCategories.enemy);

		//this.graphics = graphics_engine;
		this._physics = physics_engine;

		this.sensor = new EnemySensor(SENSOR_RADIUS, 
			graphics_engine, physics_engine, this);

		this.turn_angle = 0;//turn towards player
	}

	/** @param {SimplePhysics} physics_engine */
	_destroy_(physics_engine) {
		this.sensor._destroy_(this._physics);
		super.destroy();
	}

	/** @param {Player} player */
	onPlayerInRange(player) {
		//chase player by turning into his direction
		this.turn_angle = Math.atan2(
			player.getTransform().y - this.getTransform().y,
			player.getTransform().x - this.getTransform().x
		);
	}

	/**
	* @param {number} rot
	*/
	setRot(rot) {
		let speed = Math.max(0.1, this.body.velocity.length());
		this.body.velocity.set(Math.cos(rot+Math.PI/2)*speed, Math.sin(rot+Math.PI/2)*speed);

		return super.setRot(rot);
	}

	/** 
	 * @param  {number?} dt
	 * @param  {boolean?} paused
	 */
	update(dt, paused = false) {
		//keeping enemy constant speed
		let speed = this.body.velocity.length();
		let angle = Math.atan2(this.body.velocity.y, this.body.velocity.x);
		if(this.turn_angle !== 0) {
			angle = angleLerp(angle, this.turn_angle, 0.05);
			this.turn_angle = 0;
		}

		let sd = Math.max(-1.0, Math.min(1.0, 1.0 - speed / ENEMY_SPEED));
		
		speed += sd * Math.min(1, dt*0.001);
		this.body.velocity.set(Math.cos(angle)*speed, Math.sin(angle)*speed);

		let target_rot = angle - Math.PI/2.0;
		super.setRot( angleLerp(this.transform.rot, target_rot, Math.min(1, dt*0.01)) );

		super.update(dt, paused);
		this.sensor.setPos(this.getTransform().x, this.getTransform().y);
		this.sensor.update(dt, paused);
	}
}