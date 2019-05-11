// @ts-check
import SvgEngine from './../svg_engine';
import SvgObject from './../svg';

import SimplePhysics from './../simple_physics/engine';
import animate from './keyframe_animation';

/**
* 	@typedef {{
		x: number, y: number, 
		w: number, h: number, 
		rot: number,
	}} 
	Transform
*/

const SCALLER = 20;

export const Type = {
	CIRCLE: 0,
	RECT: 1
};

const MAX_RANGE = 50;

export default class Object2D extends SvgObject {
	/**
	* @param {number} type
	* @param {number} width
	* @param {number} height
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	*/
	constructor(type, width, height, graphics_engine, physics_engine, layer_index = 1) {
		switch(type) {
			case Type.CIRCLE: {
				super('circle');
				this.body = physics_engine.createCircle(width*SCALLER);
			}	break;
			case Type.RECT: {
				super('rect');
				this.body = physics_engine.createRect(width*SCALLER, height*SCALLER);
			}	break;
			default:
				throw new Error('Incorrect object2d type');
		}

		this.type = type;
		this.static = false;
		
		/** @type {{time: number, transform: Transform}[]} animation keyframes */
		this.keyframes = [];
		this.keyframe_id = 0;
		this.animation_time = 0;

		this.to_destroy = false;

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
			this.transform.x < -MAX_RANGE || this.transform.x > MAX_RANGE ||
			this.transform.y < -MAX_RANGE || this.transform.y > MAX_RANGE
		);
	}

	getClassName() {
		return this.node.getAttributeNS(null, 'class') || undefined;
	}

	setStatic() {
		this.static = true;
		this.body.setStatic();
		return this;
	}

	resetVelocities() {
		this.body.resetVelocities();
		return this;
	}

	/**
	* @param {number} x
	* @param {number} y
	*/
	setPos(x, y) {
		// this.body.setPos(x*SCALLER, y*SCALLER);
		this.body.setPos(x*SCALLER, y*SCALLER);
		return super.setPos(x, y);
	}

	/**
	* @param {number} rot
	*/
	setRot(rot) {
		this.body.setRot(rot);
		return super.setRot(rot);
	}

	/** 
	 * @param  {number?} dt
	 * @param  {boolean?} paused
	 */
	update(dt, paused = false) {
		if(!paused && this.static && this.keyframes.length > 0)
			animate(this, dt);
		super.setPos( this.body.pos.x/SCALLER, this.body.pos.y/SCALLER );
		super.setRot(this.body.rot);
			
		super.update(dt);
	}
}

