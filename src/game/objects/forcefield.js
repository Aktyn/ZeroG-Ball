//@ts-check
import Object2D, {Type} from './object2d';
import Player from './player';
import CollisionCategories from './collision_categories';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';
import Config from './../config';

const INITIAL_RADIUS = 0.225;
const SHRINKING_TIME = 2000;

export default class Forcefield extends Object2D {
	/**
	* @param {number} w
	* @param {number} h
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	*/
	constructor(w, h, graphics_engine, physics_engine) {
		super(Type.CIRCLE, w, h, graphics_engine, physics_engine);

		this.body.setMask( ~CollisionCategories.player );//everything except player

		this.lifetime = Config.forcefield_duration*1000 - SHRINKING_TIME;
		this.shrinking_time = SHRINKING_TIME;

		/** @type {Player} Player object handle */
		this.player = null;
	}

	/** @param {Player} _player */
	activate(_player) {
		this.player = _player;
	}

	/** @param {number} dt */
	update(dt) {
		if(this.player) {
			let dx = this.player.getTransform().x - this.getTransform().x;
			let dy = this.player.getTransform().y - this.getTransform().y;

			this.player.setPos( 
				this.player.getTransform().x - dx*dt*0.03, 
				this.player.getTransform().y - dy*dt*0.03 
			);
			

			let vx = this.player.body.velocity.x - this.body.velocity.x;
			let vy = this.player.body.velocity.y - this.body.velocity.y;

			this.player.body.velocity.set(
				this.player.body.velocity.x - vx*dt*0.03, 
				this.player.body.velocity.y - vy*dt*0.03 
			);

			this.body.velocity.set(
				this.body.velocity.x + vx*dt*0.01, 
				this.body.velocity.y + vy*dt*0.01 
			);

			if( (this.lifetime-=dt) < 0) {
				if( (this.shrinking_time-=dt) > 0 ) {
					let r = INITIAL_RADIUS * Math.pow(this.shrinking_time / SHRINKING_TIME, 0.125);
					this.setSize(r, r);
				}
				else
					this.to_destroy = true;
			}

			super.setRot(this.transform.rot + Math.PI * dt * -0.00055);
		}
		super.update(dt);
	}
}