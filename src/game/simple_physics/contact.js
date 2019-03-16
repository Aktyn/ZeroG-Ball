//@ts-check
import {Vec2, dotProduct} from './math';
import {Body, Circle, Rect, ShapeType} from './body';
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

	solve() {//solves only for A
		if(this.A.static)
			return;

		const bounce = 0.8;//0 - 1 -> bouncing factor

		let normal = this.A.pos.clone().substractVec(this.point).normalize();
		// debugger;
		//reflection vector equation
		//Vnew = -2*(V dot N)*N + V
		//Vnew += N * (V dot N) * -2
		/*let newVelocity = new Vec2(
			(this.A.velocity.x * (this.A.mass - this.B.mass) + 
				(2 * this.B.mass * this.B.velocity.x)) / (this.A.mass + this.B.mass),
			(this.A.velocity.y * (this.A.mass - this.B.mass) + 
				(2 * this.B.mass * this.B.velocity.y)) / (this.A.mass + this.B.mass)
		);*/

		//debugger;

		this.A.velocity.addVec(
			normal.scale(dotProduct(this.A.velocity, normal) * -2.0) 
		);//.scale(bounce);//.scale(newVelocity.length());

		let Bvel = this.B.velocity.clone().addVec(
			normal.scale(dotProduct(this.B.velocity, normal) * -2.0) 
		).reverse();//.scale(bounce);

		this.A.velocity.set(
			this.A.velocity.x * this.A.mass + Bvel.x * this.B.mass,
			this.A.velocity.y * this.A.mass + Bvel.y * this.B.mass,
		).scale( 1.0 / (this.A.mass + this.B.mass) * bounce );


		//let newVelX2 = (this.B.velocity.x * (this.B.mass – this.A.mass) + 
		//	(2 * this.A.mass * this.A.velocity.x)) / (this.A.mass + this.B.mass);
		//let newVelY2 = (this.B.velocity.y * (this.B.mass – this.A.mass) + 
		//	(2 * this.A.mass * this.A.velocity.y)) / (this.A.mass + this.B.mass);
		


		let v2 = this.A.velocity.length();
		if(v2 < Config.gravity*Config.PHYSIC_STEP)//if(v2 < Config.gravity_step)
			this.A.velocity.scale(0.5);//this.A.velocity.set(0, 0);//
		// debugger;
		//resources used for velocity recalculation:
		//https://en.wikipedia.org/wiki/Dot_product
		//http://www.3dkingdoms.com/weekly/weekly.php?a=2

		let solve_dst = this.B.static ? this.overlap : this.overlap/2;
		this.A.pos.addVec(
			this.A.pos.clone().substractVec(this.point).normalize().scale(solve_dst * 1.1)
		);

		this.A.colliding = true;
	}
}