
//https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-oriented-rigid-bodies--gamedev-8032

// f32 m_dt; //step
// uint32 m_iterations;
// std::vector<Body *> bodies;
// std::vector<Manifold> contacts;

import Config from './../config';
import Body from './body';
import Shape from './shape';
import Manifold from './manifold';

const STEP = Config.step;

/** 
*	@param {Body} b
*/
function integrateForces(b) {
	if(b.im === 0)
		return;

	//b.velocity += (b.force * b.im + gravity) * (STEP / 2.);
	b.velocity.addVec( 
		b.force.clone().scale(b.im).addVec(Config.gravity).scale(STEP/2.0)
	);
	b.angularVelocity += b.torque * b.iI * (STEP / 2.0);
}

/** 
*	@param {Body} b
*/
function integrateVelocity(b) {
	if(b.im === 0)
		return;

	//b.position += b.velocity * dt;
	//console.log(b.position, b.velocity.clone().scale(STEP));
	b.position.addVec( b.velocity.clone().scale(STEP) );
	b.orient += b.angularVelocity * STEP;
	b.setOrient(b.orient);
	integrateForces(b);
}

export default class PhysicsEngine {
	constructor(iterations = 10) {
		//this.step = STEP;
		this.iterations = iterations;

		/** @type {Body[]} */
		this.bodies = [];
		/** @type {Manifold[]} */
		this.contacts = [];
	}

	step() {
		// Generate new collision info
		this.contacts = [];
		for(var i=0; i<this.bodies.length; i++) {//TODO - for of
			let A = this.bodies[i];

			for(var j=i+1; j<this.bodies.length; j++) {
				let B = this.bodies[j];
				if(A.im === 0 && B.im === 0)//ignore two static bodies
					continue;

				let m = new Manifold(A, B);
				m.solve();
				if(m.contact_count)
					this.contacts.push(m);
					//this.contacts.emplace_back(m);
			}
		}

		// Integrate forces
		for(var i=0; i < this.bodies.length; i++)
			integrateForces(this.bodies[i]);

		// Initialize collision
		for(var i=0; i < this.contacts.length; i++)
			this.contacts[i].initialize();

		// Solve collisions
		for(var j=0; j < this.iterations; j++) {
			for(var i=0; i < this.contacts.length; i++) {
				this.contacts[i].applyImpulse();
			}
		}

		// Integrate velocities
		for(var i=0; i < this.bodies.length; i++)
			integrateVelocity(this.bodies[i]);

		// Correct positions
		for(var i=0; i < this.contacts.length; i++)
			this.contacts[i].positionalCorrection();

		// Clear all forces
		for(var i=0; i < this.bodies.length; i++) {//TODO - for of
			let b = this.bodies[i];
			b.force.set(0, 0);
			b.torque = 0;
		}
	}

	/** 
		@param {Shape} shape
		@param {number} x
		@param {number} y
		@returns {Body}
	*/
	add(shape, x, y) {
		let b = new Body(shape, x, y);
		this.bodies.push( b );
		return b;
	}
}