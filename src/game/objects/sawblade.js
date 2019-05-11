//@ts-check
import Object2D, {Type} from './object2d';
import CollisionCategories from './collision_categories';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';

export default class SawBlade extends Object2D {
	/**
	* @param {number} w
	* @param {number} h
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	*/
	constructor(w, h, graphics_engine, physics_engine) {
		super(Type.CIRCLE, w, h, graphics_engine, physics_engine);

		this.body.setCategory( CollisionCategories.sawblade );
	}

	/** 
	 * @param  {number?} dt
	 * @param  {boolean?} paused
	 */
	update(dt, paused = false) {
		super.setRot(this.transform.rot + Math.PI * dt * -0.00075);
		super.update(dt, paused);
	}
}