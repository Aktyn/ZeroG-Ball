// @ts-check
<<<<<<< HEAD
import SvgEngine from './../svg_engine';
<<<<<<< HEAD
import Physics from './../physics/physics_engine';
import SvgObject from './../svg';

import {Circle, PolygonShape} from './../physics/shape';
=======
import SvgObject from './../svg';

import SimplePhysics from './../simple_physics/engine';
import animate from './keyframe_animation';

=======
import SvgEngine from '../svg_engine';
import SvgObject from '../svg';

import SimplePhysics from '../simple_physics/engine';
import {ShapeType} from '../simple_physics/body';
import animate from './keyframe_animation';

import Config from '../config';

>>>>>>> origin/stage3
/**
* 	@typedef {{
		x: number, y: number, 
		w: number, h: number, 
		rot: number,
	}} 
	Transform
*/
<<<<<<< HEAD
>>>>>>> stage3

const SCALLER = 20;
=======
>>>>>>> origin/stage3

export const Type = {
	CIRCLE: 0,
	RECT: 1
};

<<<<<<< HEAD
<<<<<<< HEAD
=======
const MAX_RANGE = 50;

>>>>>>> stage3
=======
>>>>>>> origin/stage3
export default class Object2D extends SvgObject {
	/**
	* @param {number} type
	* @param {number} width
	* @param {number} height
	* @param {SvgEngine} graphics_engine
<<<<<<< HEAD
<<<<<<< HEAD
	* @param {Physics} physics_engine
	*/
	constructor(type, width, height, graphics_engine, physics_engine) {
		switch(type) {
			case Type.CIRCLE: {
				super('circle');

				let shape = new Circle(width*SCALLER);
				this.body = physics_engine.add(shape, 0, 0);
			}	break;
			case Type.RECT: {
				super('rect');

				let shape = new PolygonShape();
				shape.setBox(width*SCALLER, height*SCALLER);
				this.body = physics_engine.add(shape, 0, 0);
				this.body.setOrient(0);
=======
=======
>>>>>>> origin/stage3
	* @param {SimplePhysics} physics_engine
	*/
	constructor(type, width, height, graphics_engine, physics_engine, layer_index = 1) {
		switch(type) {
			case Type.CIRCLE: {
				super('circle');
<<<<<<< HEAD
				this.body = physics_engine.createCircle(width*SCALLER);
			}	break;
			case Type.RECT: {
				super('rect');
				this.body = physics_engine.createRect(width*SCALLER, height*SCALLER);
>>>>>>> stage3
=======
				this.body = physics_engine.createCircle(width*Config.SCALLER);
			}	break;
			case Type.RECT: {
				super('rect');
				this.body = physics_engine.createRect(width*Config.SCALLER, height*Config.SCALLER);
>>>>>>> origin/stage3
			}	break;
			default:
				throw new Error('Incorrect object2d type');
		}

<<<<<<< HEAD
<<<<<<< HEAD
		super.setSize(width, height);
		graphics_engine.addObjects(this);
	}

	setStatic() {
=======
=======
>>>>>>> origin/stage3
		this.type = type;
		this.static = false;
		
		/** @type {{time: number, transform: Transform}[]} animation keyframes */
		this.keyframes = [];
		this.keyframe_id = 0;
		this.animation_time = 0;

		this.to_destroy = false;
<<<<<<< HEAD
=======
		this.editable = true;
>>>>>>> origin/stage3

		super.setSize(width, height);
		//if(push_at_beginning)
		//	graphics_engine.addObjectsBelow(1, this);
		//else
		graphics_engine.addObjects(layer_index, this);

		this.body.setCustomData(this);
	}

	/** @param {SimplePhysics} physics_engine */
	_destroy_(physics_engine) {
		physics_engine.removeObject(this.body);
		super.destroy();
	}

	/**
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	*/
	clone(graphics_engine, physics_engine) {
		let copy = new Object2D(
			this.type, this.transform.w, this.transform.h, graphics_engine, physics_engine
		);
		copy.setPos(this.transform.x, this.transform.y);
		copy.setRot(this.transform.rot);
		copy.setKeyframes(this.keyframes);
		if(this.static)
			copy.setStatic();

		for(let att of this.node.attributes) {
			let a = {};
			a[att.name] = att.value;
			copy.set(a);
		}

		return copy;
	}

	/**
	 * @param {{time: number, transform: Transform}[]} keyframes
	 */
	setKeyframes(keyframes) {
		if(keyframes === undefined)
			return;
		this.keyframes = keyframes;
		/*if(keyframes.length > 0) {
			let frame = keyframes[0];
			this.setPos(frame.transform.x, frame.transform.y);
			this.setRot(frame.transform.rot);
			this.setSize(frame.transform.w, frame.transform.h);
		}*/
	}

	isOutOfRange() {
		return !this.static && (//only dynamic objects
<<<<<<< HEAD
			this.transform.x < -MAX_RANGE || this.transform.x > MAX_RANGE ||
			this.transform.y < -MAX_RANGE || this.transform.y > MAX_RANGE
		);
	}

=======
			this.transform.x < -Config.MAX_RANGE || this.transform.x > Config.MAX_RANGE ||
			this.transform.y < -Config.MAX_RANGE || this.transform.y > Config.MAX_RANGE
		);
	}

	/** @return {string} */
>>>>>>> origin/stage3
	getClassName() {
		return this.node.getAttributeNS(null, 'class') || undefined;
	}

	setStatic() {
		this.static = true;
<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3
		this.body.setStatic();
		return this;
	}

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> origin/stage3
	resetVelocities() {
		this.body.resetVelocities();
		return this;
	}

<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3
	/**
	* @param {number} x
	* @param {number} y
	*/
	setPos(x, y) {
<<<<<<< HEAD
		this.body.setPos(x*SCALLER, y*SCALLER);
=======
		this.body.setPos(x*Config.SCALLER, y*Config.SCALLER);
>>>>>>> origin/stage3
		return super.setPos(x, y);
	}

	/**
	* @param {number} rot
	*/
	setRot(rot) {
<<<<<<< HEAD
<<<<<<< HEAD
		this.body.setOrient(rot);
		return super.setRot(rot);
	}

	update() {
		super.setPos( this.body.position.x/SCALLER, this.body.position.y/SCALLER );
		super.setRot(this.body.orient);

		super.update();
=======
		this.body.setRot(rot);
		return super.setRot(rot);
=======
		this.body.setRot(rot);
		return super.setRot(rot);
	}

	/**
	* @param {number} w
	* @param {number} h
	*/
	setSize(w, h) {
		if(this.body.shape_type === ShapeType.CIRCLE)
			//@ts-ignore
			this.body.radius = w*Config.SCALLER;//instance of circle
		else {
			//@ts-ignore
			this.body.width = w*Config.SCALLER;
			//@ts-ignore
			this.body.height = h*Config.SCALLER;
		}
		this.body.recalculateMass();
		return super.setSize(w, h);
>>>>>>> origin/stage3
	}

	/** 
	 * @param  {number?} dt
	 * @param  {boolean?} paused
	 */
	update(dt, paused = false) {
		if(!paused && this.static && this.keyframes.length > 0)
			animate(this, dt);
<<<<<<< HEAD
		super.setPos( this.body.pos.x/SCALLER, this.body.pos.y/SCALLER );
		super.setRot(this.body.rot);
			
		super.update(dt);
>>>>>>> stage3
	}
}

=======
		super.setPos( this.body.pos.x/Config.SCALLER, this.body.pos.y/Config.SCALLER );
		super.setRot(this.body.rot);
			
		super.update(dt);
	}
}

Object2D.SCALLER = Config.SCALLER;
>>>>>>> origin/stage3
