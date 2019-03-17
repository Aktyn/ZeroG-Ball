// @ts-check
import {Vec2, crossVV} from './math';
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
		this.angular_velocity = 0;

		this.colliding = false;
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

	/** 
	*	@param {Vec2} impulse
	*	@param {Vec2} contactVector
	*/
	applyImpulse(impulse, contactVector) {
		// velocity += im * impulse;
		this.velocity.x += /*this.im * */impulse.x;
		this.velocity.y += /*this.im * */impulse.y;
		this.angular_velocity += /*this.iI * */crossVV( contactVector, impulse );
	}

	update() {
		if(this.static)
			return;

		//apply velocities
		this.pos.addVec( this.velocity );
		this.rot += this.angular_velocity * Config.PHYSIC_STEP;

		let g = Config.gravity_step_sqr;
		this.velocity.y += g;

		if(this.colliding) {
			this.pos.add(0, g);//stick to the ground
			this.colliding = false;
		}
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