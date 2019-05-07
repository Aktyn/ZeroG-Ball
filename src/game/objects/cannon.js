//@ts-check
import Object2D, {Type} from './object2d';
import CollisionCategories from './collision_categories';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';
import Bullet, {Types} from './bullet';

import {OBJECTS} from '../predefined_assets';

const SHOOTING_FREQUENCY = 1000 * 0.5;//shoots every 5 seconds
const BULLET_SIZE = 0.075;
const BULLET_SPEED = 1;

export default class Cannon extends Object2D {
	/**
	* @param {number} w
	* @param {number} h
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	*/
	constructor(w, h, graphics_engine, physics_engine) {
		super(Type.CIRCLE, w, h, graphics_engine, physics_engine, 2);

		this.time_to_shoot = SHOOTING_FREQUENCY;
		this.r = OBJECTS.cannon.radius;
		
		//engine handles stored for creating bullet objects
		this._graphics = graphics_engine;
		this._physics = physics_engine;

		/** @type {Bullet[]} */
		this.bullets = [];
	}

	/** @param {SimplePhysics} physics_engine */
	_destroy_(physics_engine) {
		for(let b of this.bullets)
			b._destroy_(physics_engine);
		super._destroy_(physics_engine);
	}

	/** @param {number} dt */
	update(dt) {
		if( (this.time_to_shoot -= dt) <= 0 ) {//shoot
			this.time_to_shoot += SHOOTING_FREQUENCY;

			let obj = new Bullet(BULLET_SIZE, BULLET_SIZE, this._graphics, this._physics, 
				Types.cannon_bullet);

			let transform = this.getTransform();
			let cos = Math.cos(transform.rot - Math.PI/2);
			let sin = Math.sin(transform.rot - Math.PI/2);
			obj.setPos(
				transform.x + cos * (this.r + BULLET_SIZE),
				transform.y + sin * (this.r + BULLET_SIZE)
			);
			obj.body.velocity.set(cos*BULLET_SPEED, sin*BULLET_SPEED);
			this.bullets.push(obj);
		}
		let to_remove = [];
		for(let b of this.bullets) {
			if(b.to_destroy)
				to_remove.push(b);
			else
				b.update(dt);
		}
		
		to_remove.forEach(b => {
			this.bullets.splice(this.bullets.indexOf(b), 1);
			b._destroy_(this._physics);
		});
		super.update(dt);
	}
}