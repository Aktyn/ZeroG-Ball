//@ts-check
import Object2D, {Type} from './object2d';
import CollisionCategories from './collision_categories';
import Config from './../config';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';
<<<<<<< HEAD
=======
import PowerUpBase from './powerups/powerup_base';
>>>>>>> origin/stage3

const SPEED_LIMIT = 0.8;
const INITIAL_HEALTH = 3;
const DAMAGE_IMMUNITY = 0.5;
<<<<<<< HEAD
=======
const ACCELERATION = 0.00075;
const BREAKS = 0.003;
>>>>>>> origin/stage3
/**
* @callback on_hp_change_cb
 * @param {number} damage
 */

<<<<<<< HEAD
=======
/**
* @callback on_powerup_collected_cb
 * @param {PowerUpBase} powerup
 */

>>>>>>> origin/stage3
export default class Player extends Object2D {
	/**
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	* @param {on_hp_change_cb} on_hp_change
<<<<<<< HEAD
	*/
	constructor(graphics_engine, physics_engine, on_hp_change) {
=======
	* @param {on_powerup_collected_cb} on_powerup_collected
	*/
	constructor(graphics_engine, physics_engine, on_hp_change, on_powerup_collected) {
>>>>>>> origin/stage3
		super(Type.CIRCLE, Config.player_size, Config.player_size, graphics_engine, physics_engine);
		super.setClass('player');

		this.body.setCategory( CollisionCategories.player );

		this.on_hp_change = on_hp_change;
<<<<<<< HEAD
=======
		this.on_powerup_collected = on_powerup_collected;
>>>>>>> origin/stage3

		this.health = INITIAL_HEALTH;//number of health segments
		this.immunity = DAMAGE_IMMUNITY;

<<<<<<< HEAD
		this._acceleration = 0.0005;
		this._breaks_strength = 0.003;
=======
		this._acceleration = ACCELERATION;
		this._breaks_strength = BREAKS;
		this.speed_limit = SPEED_LIMIT;

		/** @type {PowerUpBase []} */
		this.powerUpArray = [];
>>>>>>> origin/stage3
	}

	/**
	* @param {{x: number, y: number}} dir
	* @param {number} delta
	*/
	move(dir, delta) {
		//console.log(dir, delta);

		this.body.applyVelocity(
			dir.x*this._acceleration*delta, dir.y*this._acceleration*delta, 
<<<<<<< HEAD
			SPEED_LIMIT
=======
			this.speed_limit
>>>>>>> origin/stage3
		);
	}

	/**
	* @param {number} delta
	*/
	slowDown(delta) {
		this.body.velocity.scale(1.0 - delta*this._breaks_strength);
	}

<<<<<<< HEAD
=======
	toogleSpeed(enable) {
		if(enable) {
			this._acceleration = ACCELERATION * 2;
			this.speed_limit = SPEED_LIMIT * 2;
		} else {
			this._acceleration = ACCELERATION;
			this.speed_limit = SPEED_LIMIT;
		}
	}

>>>>>>> origin/stage3
	/** @param {number} strength */
	damage(strength) {
		if(this.immunity > 0)
			return;
		this.immunity = DAMAGE_IMMUNITY;
		this.health -= strength;
		this.on_hp_change(this.health);
	}

	kill() {
		this.health = 0;
		this.on_hp_change(this.health);
	}

<<<<<<< HEAD
=======
	/** @param {PowerUpBase} powerUp */
	isPowerupActive(powerUp) {
		return !!this.powerUpArray.find(p => powerUp instanceof p.constructor);
	}

	/** @param {PowerUpBase} powerUp */
	addPowerUp(powerUp) {
		this.powerUpArray.push(powerUp);
		this.on_powerup_collected(powerUp);
	}

>>>>>>> origin/stage3
	/** 
	 * @param  {number?} dt
	 * @param  {boolean?} paused
	 */
	update(dt, paused = false) {
		this.immunity = Math.max(0, this.immunity-dt/1000.0);
<<<<<<< HEAD
			
=======
		this.powerUpArray.forEach((powerUp, index) => {
			powerUp.applyEffect(this);
			if((powerUp.duration_time -= dt) <= 0) {
				powerUp.clearEffect(this);
				this.powerUpArray.splice(index, 1);
			}
		});
>>>>>>> origin/stage3
		super.update(dt, paused);
	}
}

<<<<<<< HEAD
Player.INITIAL_HEALTH = INITIAL_HEALTH;
=======
Player.INITIAL_HEALTH = INITIAL_HEALTH;
>>>>>>> origin/stage3
