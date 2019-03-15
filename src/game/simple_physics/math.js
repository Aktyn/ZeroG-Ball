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

	length() {
		return Math.sqrt( pow(this.x) + pow(this.y) );
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