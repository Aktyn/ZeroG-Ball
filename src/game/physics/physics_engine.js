
//https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-oriented-rigid-bodies--gamedev-8032

// f32 m_dt; //step
// uint32 m_iterations;
// std::vector<Body *> bodies;
// std::vector<Manifold> contacts;

import Config from './../config';
import Body from './body';
import Shape from './shape';

const STEP = Config.step;

/** 
*	@param {Body} b
*	@param {number} dt
*/
function integrateForces(b, dt) {
	if(b.im === 0)
		return;

	b.velocity += (b.force * b.im + gravity) * (dt / 2.);
	b.angularVelocity += b.torque * b.iI * (dt / 2.);
}

/** 
*	@param {Body} b
*	@param {number} dt
*/
function integrateVelocity(b, dt) {
	if(b.im == 0.)
		return;

	b.position += b.velocity * dt;
	b.orient += b.angularVelocity * dt;
	b.SetOrient(b.orient);
	integrateForces(b, dt);
}

export default class PhysicsEngine {
	constructor(iterations = 10) {
		//this.step = STEP;
		this.iterations = iterations;

		/** @type {Body[]} */
		this.bodies = [];
		/** @type {Contact[]} */
		this.contacts = [];
	}

	step() {
		// Generate new collision info
		contacts.clear();
		for(var i=0; i<this.bodies.length; i++) {//TODO - for of
			let A = this.bodies[i];

			for(var j=i+1; j<this.bodies.length; j++) {
				let B = this.bodies[j];
				if(A.im === 0 && B.im === 0)
					continue;

				let m = new Manifold(A, B);
				m.Solve();
				if(m.contact_count)
					contacts.emplace_back(m);
			}
		}

		// Integrate forces
		for(var i=0; i < this.bodies.length; i++)
			integrateForces(bodies[i], STEP);

		// Initialize collision
		for(var i=0; i < this.contacts.length; i++)
			contacts[i].Initialize();

		// Solve collisions
		for(var j=0; j < this.m_iterations; j++)
			for(var i=0; i < this.contacts.length; i++)
				contacts[i].ApplyImpulse();

		// Integrate velocities
		for(var i=0; i < this.bodies.length; i++)
			integrateVelocity(bodies[i], STEP);

		// Correct positions
		for(var i=0; i < this.contacts.length; i++)
			contacts[i].PositionalCorrection();

		// Clear all forces
		for(var i=0; i < this.bodies.length; i++) {//TODO - for of
			let b = this.bodies[i];
			b.force.Set(0, 0);
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
		this.bodies.push( new Body(shape, x, y) );
		return b;
	}
}