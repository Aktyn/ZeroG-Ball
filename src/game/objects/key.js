//@ts-check
import Object2D, {Type} from './object2d';
import CollisionCategories from './collision_categories';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';

export default class Key extends Object2D {
	/**
	* @param {number} w
	* @param {number} h
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	* @param {number} type type of this key
	*/
	constructor(w, h, graphics_engine, physics_engine, type) {
		super(Type.CIRCLE, w, h, graphics_engine, physics_engine);

		this.body.setCategory( CollisionCategories.key );
		this.type = type;//TODO - make use of it when more bullet will be created
	}
}