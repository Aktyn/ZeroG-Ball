//@ts-check
import Object2D, {Type} from './object2d';
import CollisionCategories from './collision_categories';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';

export const Types = {
	'cannon_bullet': 0
};

const MAX_LIFETIME = 1000 * 5;//10 seconds
const SHRINKING_TIME = 1000 * 0.5;//last half of a second of existence

export default class Bullet extends Object2D {
	/**
	* @param {number} w
	* @param {number} h
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	* @param {number} type one of Types
	*/
	constructor(w, h, graphics_engine, physics_engine, type) {
		super(Type.CIRCLE, w, h, graphics_engine, physics_engine);

		this.body.setCategory( CollisionCategories.bullet );
		this.type = type;//TODO - make use of it when more bullet will be created

		this.r = (w+h)/2;//average of w and h

		for(let type_name of Object.keys(Types)) {
			if(Types[type_name] === type)
				this.setClass(type_name);
		}

		this.lifetime = MAX_LIFETIME;
	}

	/** @param {number} dt */
	update(dt) {
		if( (this.lifetime -= dt) <= 0 )
			this.to_destroy = true;
		else if(this.lifetime < SHRINKING_TIME) {
			let s = this.r * (this.lifetime / SHRINKING_TIME);
			this.setSize(s, s);
		}
		super.update(dt);
	}
}