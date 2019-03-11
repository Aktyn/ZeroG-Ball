import Shape from './shape';
import {Vec2, Random, CrossVV} from './math';

export default class Body {
	/** 
	*	@param {Shape} shape
	*	@param {number} x
	*	@param {number} y
	*/
	constructor(shape, x, y) {
		// Set by shape
		this.I = 0;  // moment of inertia
		this.iI = 0; // inverse inertia
		this.m = 0;  // mass
		this.im = 0; // inverse mass

		// Shape interface
		this.shape = shape.clone();

		this.shape.body = this;
		this.position = new Vec2(x, y);
		this.velocity = new Vec2(0, 0);
		this.angularVelocity = 0;
		this.torque = 0;
		//this.orient = Random(-Math.PI, Math.PI);//TODO - do not let it be random
		this.orient = 0;
		this.force = new Vec2(0, 0);
		this.staticFriction = 0.5;
		this.dynamicFriction = 0.3;
		this.restitution = 0.4;//0.2;
		this.shape.initialize();
	}

	/** 
	*	@param {number} radians
	*/
	setOrient( radians ) {
		this.orient = radians;
		this.shape.setOrient(radians);
	}

	/**
	* @param {number} x
	* @param {number} y
	*/
	setPos(x, y) {
		this.position.set(x, y);
	}

	/** 
	*	@param {Vec2} f
	*/
	applyForce(f) {
		this.force.addVec(f);
	}

	/** 
	*	@param {Vec2} impulse
	*	@param {Vec2} contactVector
	*/
	applyImpulse(impulse, contactVector) {
		// velocity += im * impulse;
		this.velocity.x += this.im * impulse.x;
		this.velocity.y += this.im * impulse.y;
		this.angularVelocity += this.iI * CrossVV( contactVector, impulse );
	}

	setStatic() {
		this.I = 0.;
		this.iI = 0.;
		this.m = 0.;
		this.im = 0.;
	}
}

