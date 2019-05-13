//@ts-check
import Object2D, {Type} from './object2d';
import Enemy from './enemy';
import CollisionCategories from './collision_categories';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';

export default class EnemySensor extends Object2D {
	/**
	* @param {number} radius
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	* @param {Enemy} owner
	*/
	constructor(radius, graphics_engine, physics_engine, owner) {
		super(Type.CIRCLE, radius, radius, graphics_engine, physics_engine, 2);

		this.owner = owner;

		this.setClass('transparent');
		this.body.setMask( 0 );//sensor object
		this.setStatic();
	}

	/** 
	 * @param  {number?} dt
	 * @param  {boolean?} paused
	 */
	update(dt, paused = false) {
		

		super.update(dt, paused);
	}
}