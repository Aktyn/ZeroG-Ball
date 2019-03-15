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

		const bounce = 0.6;//0 - 1 -> bouncing factor

		let normal = this.A.pos.clone().substractVec(this.point).normalize();

		//reflection vector equation
		//Vnew = -2*(V dot N)*N + V
		//Vnew += N * (V dot N) * -2
		this.A.velocity.addVec(
			normal.scale(dotProduct(this.A.velocity, normal) * -2) 
		).scale(bounce);

		//let v2 = this.A.velocity.length();
		//console.log(v2 - Math.pow(Config.gravity*Config.PHYSIC_STEP, 2));
		
		//resources used for velocity recalculation:
		//https://en.wikipedia.org/wiki/Dot_product
		//http://www.3dkingdoms.com/weekly/weekly.php?a=2

		let solve_dst = this.B.static ? this.overlap : this.overlap/2;
		this.A.pos.addVec(
			this.A.pos.clone().substractVec(this.point).normalize().scale(solve_dst)
		);

	}
}