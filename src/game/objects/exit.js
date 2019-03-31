//@ts-check
import Object2D, {Type} from './object2d';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';

export default class Exit extends Object2D {
	/**
	* @param {number} w
	* @param {number} h
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	*/
	constructor(w, h, graphics_engine, physics_engine) {
		super(Type.CIRCLE, w, h, graphics_engine, physics_engine);
		super.setClass('player');

		this.acceleration = 0.0005;
		this.breaks_strength = 0.003;
	}

	/** @param {number} dt */
	update(dt) {
		super.setRot(this.transform.rot + Math.PI * dt * -0.0003);
		super.update(dt);
	}
}