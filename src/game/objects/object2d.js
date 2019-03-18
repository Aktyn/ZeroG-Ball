// @ts-check
import SvgEngine from './../svg_engine';
import Physics from './../physics/physics_engine';
import {Circle, PolygonShape} from './../physics/shape';
import SvgObject from './../svg';

import SimplePhysics from './../simple_physics/engine';
import Config from './../config';

const SCALLER = 20;

export const Type = {
	CIRCLE: 0,
	RECT: 1
};

export default class Object2D extends SvgObject {
	/**
	* @param {number} type
	* @param {number} width
	* @param {number} height
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics|Physics} physics_engine
	*/
	constructor(type, width, height, graphics_engine, physics_engine) {
		switch(type) {
			case Type.CIRCLE: {
				super('circle');

				if(physics_engine instanceof SimplePhysics)
					this.body = physics_engine.createCircle(width*SCALLER);
				else {
					let shape = new Circle(width*SCALLER);
					this.body = physics_engine.add(shape, 0, 0);
				}
			}	break;
			case Type.RECT: {
				super('rect');

				if(physics_engine instanceof SimplePhysics)
					this.body = physics_engine.createRect(width*SCALLER, height*SCALLER);
				else {
					let shape = new PolygonShape();
					shape.setBox(width*SCALLER, height*SCALLER);
					this.body = physics_engine.add(shape, 0, 0);
					this.body.setOrient(0);
				}
			}	break;
			default:
				throw new Error('Incorrect object2d type');
		}

		this.type = type;
		this.static = false;

		super.setSize(width, height);
		graphics_engine.addObjects(this);
	}

	/** @param {SimplePhysics|Physics} physics_engine */
	_destroy_(physics_engine) {
		//@ts-ignore
		physics_engine.removeObject(this.body);
		super.destroy();
	}

	/**
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics|Physics} physics_engine
	*/
	clone(graphics_engine, physics_engine) {
		let copy = new Object2D(
			this.type, this.transform.w, this.transform.h, graphics_engine, physics_engine
		);
		copy.setPos(this.transform.x, this.transform.y);
		copy.setRot(this.transform.rot);

		for(let att of this.node.attributes) {
			let a = {};
			a[att.name] = att.value;
			copy.set(a);
		}

		return copy;
	}

	getClassName() {
		return this.node.getAttributeNS(null, 'class') || undefined;
	}

	setStatic() {
		this.static = true;
		this.body.setStatic();
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
		if(Config.PHYSICS_ENGINE === 'advanced')
			//@ts-ignore
			this.body.setOrient(rot);
		else
			//@ts-ignore
			this.body.setRot(rot);
		return super.setRot(rot);
	}

	update() {
		if(Config.PHYSICS_ENGINE === 'advanced') {
			//@ts-ignore
			super.setPos( this.body.position.x/SCALLER, this.body.position.y/SCALLER );
			//@ts-ignore
			super.setRot(this.body.orient);
		}
		else {
			//@ts-ignore
			super.setPos( this.body.pos.x/SCALLER, this.body.pos.y/SCALLER );
			//@ts-ignore
			super.setRot(this.body.rot);
		}
			

		super.update();
	}
}

