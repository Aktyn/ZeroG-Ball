//@ts-check
import Config from './../config';

/** @param {number} a*/
function pow(a) {
	return a*a;
}

export class Vec2 {
	/**
	* @param {number} x
	* @param {number} y
	*/
	constructor(x = 0, y = 0) {
		this.set(x, y);
	}

	/**
	* @param {number} _x
	* @param {number} _y
	*/
	set(_x, _y) {
		this.x = _x;
		this.y = _y;
		return this;
	}

	/**
	* @param {Vec2} vec
	*/
	setVec(vec) {
		return this.set(vec.x, vec.y);
	}

	clone() {
		return new Vec2(this.x, this.y);
	}

	/**
	* @param {number} x
	* @param {number} y
	*/
	add(x, y) {
		this.x += x;
		this.y += y;
		return this;
	}

	/**
	* @param {Vec2} vec
	*/
	addVec(vec) {
		return this.add(vec.x, vec.y);
	}

	/**
	* @param {Vec2} vec
	*/
	substractVec(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		return this;
	}

	/** @param {number} factor */
	scale(factor) {
		this.x *= factor;
		this.y *= factor;
		return this;
	}

	/** @param {number} angle */
	rotate(angle) {//rotates around point [0, 0]
		let s = Math.sin(angle);
		let c = Math.cos(angle);
		let xx = this.x * c - this.y * s;
		let yy = this.y * c + this.x * s;
		return this.set(xx, yy);
	}

	normalize() {
		let len = this.length();
		if(len < Config.EPSILON) {
			this.x = 0;
			this.y = 1;
		}
		else {
			this.x /= len;
			this.y /= len;
		}
		return this;
	}

	reverse() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}

	lengthSqr() {
		return pow(this.x) + pow(this.y);
	}

	length() {
		return Math.sqrt( this.lengthSqr() );
	}

	/**
	* @param {Vec2} vec
	*/
	distanceToVecSqr(vec) {
		return pow(vec.x - this.x) + pow(vec.y - this.y);
	}

	/**
	* @param {Vec2} vec
	*/
	distanceToVec(vec) {
		return Math.sqrt(this.distanceToVecSqr(vec));
	}
}

/**
* @param {Vec2} v1
* @param {Vec2} v2
*/
export function dotProduct(v1, v2) {
	return v1.x*v2.x + v1.y*v2.y;
}

/**
* @param {Vec2} point
* @param {Vec2} l1
* @param {Vec2} l2
* @param {Vec2} out_projection
*/
export function distanceToLineSegment(point, l1, l2, out_projection = new Vec2()) {
	let len = l1.clone().substractVec(l2).lengthSqr();//segment length

	const t = Math.max(0, //TODO - clamp
		Math.min(1, dotProduct(point.clone().substractVec(l1), l2.clone().substractVec(l1)) / len)
	);

	//projection = v + t * (w - v);
	out_projection.setVec( 
		l1.clone().addVec(l2.clone().substractVec(l1).scale(t)) 
	);
	
	//return projection.substractVec(point).length();
	return point.clone().substractVec(out_projection).length();
}