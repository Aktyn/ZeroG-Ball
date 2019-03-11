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
			case Type.CIRCLE:
				super('circle');
				break;
			case Type.RECT:
				super('rect');
				break;
			default:
				throw new Error('Incorrect object2d type');
		}

		super.setSize(width, height);

		graphics_engine.addObjects(this);

		let shape = new Circle(0.5);//TODO - according to type
		this.body = physics_engine.add(shape, 0, 0);
	}
}

