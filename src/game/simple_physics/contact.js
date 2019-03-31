//@ts-check
import {Vec2, dotProduct, crossNV, crossVV} from './math';
import {Body, Circle, Rect, ShapeType} from './body';
import Config from './../config';

const bounce = 1;//0.5;//0 - 1 -> bouncing factor

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

	solve() {//solves only for A
		if(this.A.static)
			return;

		if(this.A.shape_type === ShapeType.CIRCLE) {
			if(this.B.shape_type === ShapeType.RECT || this.B.static)
				this.solveCircleToStatic(this.A);
			else if(this.B.shape_type === ShapeType.CIRCLE)
				this.solveCircleToCircle(this.A, this.B);
		}

		this.A.colliding = true;

		// resources used for velocity recalculation:
		//https://en.wikipedia.org/wiki/Dot_product
		//http://www.3dkingdoms.com/weekly/weekly.php?a=2
		//https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-oriented-rigid-bodies--gamedev-8032
	}

	/**
	* @param {Body} circle
	*/
	solveCircleToStatic(circle) {
		let normal = circle.pos.clone().substractVec(this.point).normalize();

		circle.next_velocity = circle.velocity.clone().addVec(
			normal.scale(dotProduct(circle.velocity, normal) * -2.0) 
		).scale(bounce);

		if(circle.next_velocity.length() < Config.EPSILON)//Config.gravity*Config.PHYSIC_STEP)
			circle.next_velocity.scale(0.5);
	}

	/**
	* @param {Body} c1
	* @param {Body} c2
	*/
	solveCircleToCircle(c1, c2) {//both circles should be dynamic
		//computations from 
		//https://www.lucidar.me/en/mechanics/elastic-collision-equations-simulation-part-2/

        let alpha1 = Math.atan2(c2.pos.y-c1.pos.y , c2.pos.x-c1.pos.x );//angle between circles
        let beta1 = Math.atan2(c1.velocity.y, c1.velocity.x);//velocity angle
        let gamma1 = beta1 - alpha1;
        
        let u12 = c1.velocity.length() * Math.cos(gamma1);
        let u11 = c1.velocity.length() * Math.sin(gamma1);

        let alpha2 = Math.atan2(c1.pos.y-c2.pos.y , c1.pos.x-c2.pos.x );//angle between circles reversed
        let beta2 = Math.atan2(c2.velocity.y, c2.velocity.x);
        let gamma2 = beta2 - alpha2;

        let u21 = c2.velocity.length() * Math.cos(gamma2);

        let v12 = ( (c1.mass-c2.mass)*u12 - 2.0*c2.mass*u21 ) / (c1.mass + c2.mass);

        //calculate resulting velocity
        c1.next_velocity = new Vec2(
        	u11 * -Math.sin(alpha1) + 	v12 * Math.cos(alpha1),
        	u11 * Math.cos(alpha1) 	+ 	v12 * Math.sin(alpha1)
        ).scale(bounce);

        if(c1.next_velocity.length() < Config.EPSILON)//Config.gravity*Config.PHYSIC_STEP
			c1.next_velocity.scale(0.5);
	}

	fixCollision() {//moves object so it is no more colliding
		if(this.A.static)
			return;
		let solve_dst = this.B.static ? this.overlap : this.overlap/2;
		this.A.pos.addVec(
			this.A.pos.clone().substractVec(this.point).normalize().scale(solve_dst+0.01)
		);
	}
}