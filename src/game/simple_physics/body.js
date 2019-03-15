// @ts-check
import {Vec2} from './math';
import Config from './../config';

export const ShapeType = {
	CIRCLE: 0,
	RECT: 1
};

export class Body {
	/** @param {number} _shape_type */
	constructor(_shape_type) {
		this.shape_type = _shape_type;

		this.pos = new Vec2();
		this.rot = 0;

		this.static = false;

		this.mass = 1;
		this.velocity = new Vec2();
	}

	/** 
	* 	@param {number} x
	* 	@param {number} y
	*/
	setPos(x, y) {
		this.pos.set(x, y);
	}

	/** 
	* 	@param {number} _rot
	*/
	setRot(_rot) {
		this.rot = _rot;
	}

	setStatic() {
		this.static = true;
	}

	update() {
		if(this.static)
			return;

		//apply force and movement
		this.pos.addVec(this.velocity);
		this.velocity.y += Math.pow(Config.gravity * Config.PHYSIC_STEP, 2);
	}
}

export class Circle extends Body {
	/** 
	* 	@param {number} _radius
	*/
	constructor(_radius) {
		super(ShapeType.CIRCLE);
		this.radius = _radius;
	}
}

export class Rect extends Body {
	/** 
	* 	@param {number} _width
	* 	@param {number} _height
	*/
	constructor(_width, _height) {
		super(ShapeType.RECT);
		this.width = _width;
		this.height = _height;
	}
}