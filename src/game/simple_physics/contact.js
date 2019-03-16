//@ts-check
import {Vec2, dotProduct, crossNV, crossVV} from './math';
import {Body, Circle, Rect, ShapeType,} from './body';
import Config from './../config';

export default class Contact {
	/**
	* @param {Body} A
	* @param {Body} B
	* @param {Vec2} contact_point
	* @param {number} overlap
	*/
	constructor(A, B, contact_point, overlap) {
		this.A = A;
		this.B = B;
		this.point = contact_point;
		this.overlap = overlap;
	}

	/*solve() {//solves only for A
		if(this.A.static)
			return;

		const bounce = 0.5;//0 - 1 -> bouncing factor

		let normal = this.A.pos.clone().substractVec(this.point).normalize();

		this.A.velocity.addVec(
			normal.scale(dotProduct(this.A.velocity, normal) * -2.0) 
		).scale(bounce);

		if(this.A.velocity.length() < Config.gravity*Config.PHYSIC_STEP)
			this.A.velocity.scale(0.5);

		// resources used for velocity recalculation:
		//https://en.wikipedia.org/wiki/Dot_product
		//http://www.3dkingdoms.com/weekly/weekly.php?a=2
		//https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-oriented-rigid-bodies--gamedev-8032

		//correct position
		this.fixCollision();

		this.A.colliding = true;
	}*/

	solveIteration() {
		if(this.A.static)
			return;

		const bounce = 0.1;//0 - 1 -> bouncing factor

		let normal_a = this.point.clone().substractVec(this.A.pos);
		let normal_b = this.point.clone().substractVec(this.B.pos);

		let normal = this.A.pos.clone().substractVec(this.point).reverse().normalize();

		//calculate relative velocity to object B
		let rv = this.B.velocity.clone()
			.addVec( crossNV(this.B.angular_velocity, normal_b) )
			.substractVec( this.A.velocity )
			.substractVec( crossNV(this.A.angular_velocity, normal_a) );

		// Relative velocity along the normal
		let contactVel = dotProduct( rv, normal );
		// Do not resolve if velocities are separating
		if(contactVel > 0) {
			//debugger;
			return;
		}

		let raCrossN = crossVV(normal_a, normal);
		let rbCrossN = crossVV(normal_b, normal);
		//let invMassSum = this.A.im + this.B.im + Sqr(raCrossN)*this.A.iI + 
		//	Sqr(rbCrossN)*this.B.iI;

		// Calculate impulse scalar
		let j = -(1.0 + bounce) * contactVel;

		// Apply impulse
		let impulse = normal.clone().scale(j);
		this.A.applyImpulse(impulse.clone().reverse(), normal_a);
		if(!this.B.static)
			this.B.applyImpulse(impulse, normal_b);

		let t = rv.clone().substractVec( 
			normal.clone().scale( contactVel ) 
		).normalize();

		//j tangent magnitude
		let jt = -dotProduct(rv, t);

		if(Math.abs(jt) < Config.EPSILON)//no need for further calculations
			return;

		// this.staticFriction = 0.5;
		let sf = 0.1;//static friction
		let df = 0.1;//dynamic friction

		// Coulumb's law
		let tangentImpulse;
		if(Math.abs( jt ) < j * sf)
			tangentImpulse = t.clone().scale(jt);//t * jt;
		else
			tangentImpulse = t.clone().scale(-j * df)//t * -j * df;

		// Apply friction impulse
		this.A.applyImpulse( tangentImpulse.clone().reverse(), normal_a );
		if(!this.B.static)
			this.B.applyImpulse( tangentImpulse, normal_b );

		//this.fixCollision();
		this.A.colliding = true;
	}

	fixCollision() {//moves object so it is no more colliding
		if(this.A.static)
			return;
		let solve_dst = this.B.static ? this.overlap : this.overlap/2;
		this.A.pos.addVec(this.A.pos.clone().substractVec(this.point).normalize().scale(solve_dst*1.1));
	}
}