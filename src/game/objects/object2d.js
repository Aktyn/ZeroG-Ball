// @ts-check
import SvgEngine from './../svg_engine';
//import Physics from './../physics/physics_engine';
//import {Circle, PolygonShape} from './../physics/shape';
import SvgObject from './../svg';

import SimplePhysics from './../simple_physics/engine';

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
	* @param {SimplePhysics} physics_engine
	*/
	constructor(type, width, height, graphics_engine, physics_engine) {
		switch(type) {
			case Type.CIRCLE: {
				super('circle');

				//let shape = new Circle(width*SCALLER);
				//this.body = physics_engine.add(shape, 0, 0);
				this.body = physics_engine.createCircle(width*SCALLER);
			}	break;
			case Type.RECT: {
				super('rect');

				//let shape = new PolygonShape();
				//shape.setBox(width*SCALLER, height*SCALLER);
				//this.body = physics_engine.add(shape, 0, 0);
				//this.body.setOrient(0);

				this.body = physics_engine.createRect(width*SCALLER, height*SCALLER);
			}	break;
			default:
				throw new Error('Incorrect object2d type');
		}

		super.setSize(width, height);
		graphics_engine.addObjects(this);
	}

	setStatic() {
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
		//this.body.setOrient(rot);
		this.body.setRot(rot);
		return super.setRot(rot);
	}

	update() {
		// super.setPos( this.body.position.x/SCALLER, this.body.position.y/SCALLER );
		super.setPos( this.body.pos.x/SCALLER, this.body.pos.y/SCALLER );
		//super.setRot(this.body.orient);
		super.setRot(this.body.rot);

		super.update();
	}
}

