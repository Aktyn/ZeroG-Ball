import Body from './body';
import Config from './../config';
import {Dispatch} from './collision';
import {Vec2, CrossNV, CrossVV, Equal, Dot, Sqr} from './math';

export default class Manifold {
	/**
	* @param {Body} a
	* @param {Body} b
	*/
	constructor(a, b) {
		this.A = a;
		this.B = b;

		this.penetration = 0;// Depth of penetration from collision
	 	this.normal = new Vec2();
	 	/** @type {Vec2[]} */
	 	this.contacts = [new Vec2(), new Vec2()];
	  	this.contact_count = 0;// Number of contacts that occured during collision
	  	this.e = 0;// Mixed restitution
	  	this.df = 0;// Mixed dynamic friction
	  	this.sf = 0;// Mixed static friction
	}

	solve() {
		Dispatch[this.A.shape.getType( )][this.B.shape.getType( )]( this, this.A, this.B );
	}

	initialize() {
		// Calculate average restitution
		this.e = Math.min( this.A.restitution, this.B.restitution );

		// Calculate static and dynamic friction
		//TODO - check if out
		this.sf = Math.sqrt( this.A.staticFriction * this.A.staticFriction );
		this.df = Math.sqrt( this.A.dynamicFriction * this.A.dynamicFriction );

		for(let i=0; i < this.contact_count; i++) {
			// Calculate radii from COM to contact
			let ra = new Vec2(this.contacts[i].x-this.A.position.x, 
				this.contacts[i].y-this.A.position.y);
			let rb = new Vec2(this.contacts[i].x-this.B.position.x, 
				this.contacts[i].y-this.B.position.y);

			//Vec2 rv = this.B.velocity + CrossNV( this.B.angularVelocity, rb ) -
			//	this.A.velocity - CrossNV( this.A.angularVelocity, ra );

			let rv = this.B.velocity.clone()
				.addVec( CrossNV(this.B.angularVelocity, rb) )
				.addVec( this.A.velocity.clone().minus() )
				.addVec( CrossNV(this.A.angularVelocity, ra).minus() );


			// Determine if we should perform a resting collision or not
			// The idea is if the only thing moving this object is gravity,
			// then the collision should be performed without any restitution

			//(Config.step * Config.gravity).LenSqr()
			if(rv.LenSqr() < Config.gravity_step + EPSILON)
				this.e = 0;
		}
	}

	applyImpulse() {
		// Early out and positional correct if both objects have infinite mass
		if(Equal(this.A.im + this.B.im, 0)) {
			this.infiniteMassCorrection( );
			return;
		}

		for(let i=0; i<this.contact_count; i++) {
			// Calculate radii from COM to contact
			let ra = new Vec2(this.contacts[i].x-this.A.position.x, 
				this.contacts[i].y-this.A.position.y);
			let rb = new Vec2(this.contacts[i].x-this.B.position.x, 
				this.contacts[i].y-this.B.position.y);

			// Relative velocity
			//Vec2 rv = this.B.velocity + Cross( this.B.angularVelocity, rb ) -
			//	this.A.velocity - Cross( this.A.angularVelocity, ra );
			let rv = this.B.velocity.clone()
				.addVec( CrossNV(this.B.angularVelocity, rb) )
				.addVec( this.A.velocity.clone().minus() )
				.addVec( CrossNV(this.A.angularVelocity, ra).minus() );

			// Relative velocity along the normal
			let contactVel = Dot( rv, this.normal );

			// Do not resolve if velocities are separating
			if(contactVel > 0)
				return;

			let raCrossN = CrossVV(ra, this.normal);
			let rbCrossN = CrossVV(rb, this.normal);
			let invMassSum = this.A.im + this.B.im + Sqr(raCrossN)*this.A.iI + 
				Sqr(rbCrossN)*this.B.iI;

			// Calculate impulse scalar
			let j = -(1.0 + this.e) * contactVel;
			j /= invMassSum;
			j /= this.contact_count;

			// Apply impulse
			//Vec2 impulse = normal * j;
			let impulse = this.normal.clone().scale(j);
			this.A.applyImpulse(impulse.clone().minus, ra);
			this.B.applyImpulse(impulse, rb);

			// Friction impulse
			//TODO - check it out becouse this variable has been calculated above
			//rv = this.B.velocity + Cross( this.B.angularVelocity, rb ) -
			//	 this.A.velocity - Cross( this.A.angularVelocity, ra );

			//Vec2 t = rv - (normal * Dot( rv, normal ));
			//t.Normalize( );
			let t = rv.clone().addVec( this.normal.clone().scale( Dot(rv, normal) ) ).Normalize();

			// j tangent magnitude
			let jt = -Dot( rv, t );
			jt /= invMassSum;
			jt /= this.contact_count;

			// Don't apply tiny friction impulses
			if(Equal(jt, 0))
				return;

			// Coulumb's law
			let tangentImpulse;
			if(Math.abs( jt ) < j * sf)
				tangentImpulse = t.clone().scale(jt);//t * jt;
			else
				tangentImpulse = t.clone().scale(-j * df)//t * -j * df;

			// Apply friction impulse
			this.A.ApplyImpulse( -tangentImpulse, ra );
			this.B.ApplyImpulse(  tangentImpulse, rb );
		}
	}

	positionalCorrection() {
		const k_slop = 0.05; // Penetration allowance
		const percent = 0.4; // Penetration percentage to correct
		//Vec2 correction = (std::max( penetration - k_slop, 0.0f ) / (this.A.im + this.B.im)) * 
		//	normal * percent;
		let correction = this.normal.clone().scale(
			(Math.max(penetration - k_slop, 0) / (this.A.im + this.B.im)) * percent
		);

		this.A.position -= correction * this.A.im;
		this.B.position += correction * this.B.im;
	}

	infiniteMassCorrection() {
		this.A.velocity.set(0, 0);
		this.B.velocity.set(0, 0);
	}
}
