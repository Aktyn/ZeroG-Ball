//@ts-check
import Object2D, {Type} from './object2d';
import Config from './../config';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';

const SPEED_LIMIT = 0.8;
const INITIAL_HEALTH = 3;

export default class Player extends Object2D {
	/**
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	*/
	constructor(graphics_engine, physics_engine) {
		super(Type.CIRCLE, Config.player_size, Config.player_size, graphics_engine, physics_engine);
		super.setClass('player');

		this.health = INITIAL_HEALTH;//number of health segments

		this._acceleration = 0.0005;
		this._breaks_strength = 0.003;
	}

	/**
	* @param {{x: number, y: number}} dir
	* @param {number} delta
	*/
	move(dir, delta) {
		//console.log(dir, delta);

		this.body.applyVelocity(
			dir.x*this._acceleration*delta, dir.y*this._acceleration*delta, 
			SPEED_LIMIT
		);
	}

	/**
	* @param {number} delta
	*/
	slowDown(delta) {
		this.body.velocity.scale(1.0 - delta*this._breaks_strength);
	}
}

Player.INITIAL_HEALTH = INITIAL_HEALTH;