//@ts-check
import Object2D, {Type} from './object2d';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';
import CollisionCategories from './collision_categories';

export default class Exit extends Object2D {
	/**
	* @param {number} w
	* @param {number} h
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	*/
	constructor(w, h, graphics_engine, physics_engine) {
		super(Type.CIRCLE, w, h, graphics_engine, physics_engine);
		this.body.setCategory( CollisionCategories.exit_portal );
	}

	/** 
	 * @param  {number?} dt
	 * @param  {boolean?} paused
	 */
	update(dt, paused = false) {
		super.setRot(this.transform.rot + Math.PI * dt * -0.0003);
		super.update(dt, paused);
	}
}