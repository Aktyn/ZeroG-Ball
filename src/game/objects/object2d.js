import SvgEngine from './../svg_engine';
import Physics from './../physics/physics_engine';
import SvgObject from './../svg';

import {Circle, PolygonShape} from './../physics/shape';

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
	* @param {Physics} physics_engine
	*/
	constructor(type, width, height, graphics_engine, physics_engine) {
		switch(type) {
			case Type.CIRCLE: {
				super('circle');

				let shape = new Circle(width);
				this.body = physics_engine.add(shape, 0, 0);
			}	break;
			case Type.RECT: {
				super('rect');

				let shape = new PolygonShape();
				shape.setBox(width, height);
				this.body = physics_engine.add(shape, 0, 0);
				this.body.setOrient(0);
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
		this.body.setPos(x, y);
		return super.setPos(x, y);
	}

	/**
	* @param {number} rot
	*/
	setRot(rot) {
		this.body.setOrient(rot);
		return super.setRot(rot);
	}

	update() {
		super.setPos( this.body.position.x, this.body.position.y );

		super.update();
	}
}

