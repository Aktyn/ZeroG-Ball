//const PI = 3.141592741;
// const EPSILON = 0.0001;
import Config from './../config';

export class Vec2 {
	constructor(x = 0, y = 0) {
		this.set(x, y);
	}

	/**
	* @param {number} x
	* @param {number} y
	*/
	set(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	clone() {
		return new Vec2(this.x, this.y);
	}

	minus() {//operator -
		//return new Vec2(-this.x, -this.y);
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}

	/**
	* @param {Vec2} v
	*/
	addVec(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	/**
	* @param {Vec2} v
	*/
	substractVec(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	/**
	* @param {number} factor
	*/
	add(factor) {
		this.x += factor;
		this.y += factor;
		return this;
	}

	/**
	* @param {number} factor
	*/
	substract(factor) {
		this.x -= factor;
		this.y -= factor;
		return this;
	}

	/**
	* @param {number} factor
	*/
	scale(factor) {
		this.x *= factor;
		this.y *= factor;
		return this;
	}

	LenSqr() {
		return this.x * this.x + this.y * this.y;
	}

	Len() {
		return Math.sqrt(this.LenSqr());
	}

	/**
	* @param {number} radians
	*/
	Rotate(radians) {
		let c = Math.cos(radians);
		let s = Math.sin(radians);

		let xp = this.x * c - this.y * s;
		let yp = this.x * s + this.y * c;

		this.x = xp;
		this.y = yp;
	}

	Normalize() {
		let len = this.Len();

		if(len > Config.EPSILON) {
			let invLen = 1.0 / len;
			this.scale(invLen);
			// this.x *= invLen;
			// this.y *= invLen;
		}
		return this;
	}
}

export class Mat2 {//2x2
	constructor(opts = {}) {
		if(opts.radians)
			this.setRadians(opts.radians);
		else {
			this.m00 = opts.a || 0;
			this.m01 = opts.b || 0;
			this.m10 = opts.c || 0;
			this.m11 = opts.d || 0;
		}
	}

	/**
	* @param {number} radians
	*/
	setRadians(radians) {
		let c = Math.cos( radians );
		let s = Math.sin( radians );

		this.m00 = c; 
		this.m01 = -s;
		this.m10 = s; 
		this.m11 =  c;
		return this;
	}

	clone() {
		return new Mat2({a: this.m00, b: this.m01, c: this.m10, d: this.m11});
	}

	abs() {
		this.m00 = Math.abs(this.m00);
		this.m01 = Math.abs(this.m01);
		this.m10 = Math.abs(this.m10);
		this.m11 = Math.abs(this.m11);
		return this;
	}

	AxisY() {
		return new Vec2(this.m00, this.m10);
	}

	AxisY() {
		return new Vec2(this.m01, this.m11);
	}

	Transpose() {
		return new Mat2({a: this.m00, b: this.m10, c: this.m01, d: this.m11});
	}

	/**
	* @param {Vec2} rhs
	*/
	multiplyByVec(rhs) {
		return new Vec2(this.m00 * rhs.x + this.m01 * rhs.y, this.m10 * rhs.x + this.m11 * rhs.y);
	}

	/**
	* @param {Mat2} rhs
	*/
	multiplyByMat(rhs) {
		return new Mat2({
			a: this.m00 * rhs.m00 + this.m01 * rhs.m10,
			b: this.m00 * rhs.m01 + this.m01 * rhs.m11,
			c: this.m10 * rhs.m00 + this.m11 * rhs.m10,
			d: this.m10 * rhs.m01 + this.m11 * rhs.m11
		});
	}
}

/** 
	@param {Vec2} a
	@param {Vec2} b
	@returns {Vec2}
*/
export function Min(a, b) {
  	return new Vec2( Math.min(a.x, b.x), Math.min(a.y, b.y) );
}

/** 
* @param {Vec2} a
* @param {Vec2} b
* @returns {Vec2}
*/
export function Max(a, b) {
	return new Vec2( Math.max( a.x, b.x ), Math.max( a.y, b.y ) );
}

/** 
* @param {Vec2} a
* @param {Vec2} b
* @returns {number}
*/
export function Dot(a, b) {
	return a.x * b.x + a.y * b.y;
}

/** 
*	@param {Vec2} a
*	@param {Vec2} b
*	@returns {number}
*/
export function DistSqr(a, b) {
	let c = new Vec2(a.x-b.x, a.y-b.y);
	return Dot(c, c);
}

/** 
*	@param {Vec2} v
*	@param {number} a
*	@returns {Vec2}
*/
export function CrossVN(v, a) {
	return new Vec2(a * v.y, -a * v.x);
}

/** 
*	@param {number} a
*	@param {Vec2} v
*	@returns {Vec2}
*/
export function CrossNV(a, v) {
	return new Vec2(-a * v.y, a * v.x);
}

/** 
*	@param {Vec2} a
*	@param {Vec2} b
*	@returns {number}
*/
export function CrossVV(a, b) {
	return a.x * b.y - a.y * b.x;
}


/** 
	@param {number} a
	@param {number} a
	@returns {boolean}
*/
export function Equal(a, b) {// Comparison with tolerance of EPSILON
	return Math.abs(a - b) <= Config.EPSILON;
}

/** 
*	@param {number} a
*	@returns {number}
*/
export function Sqr(a) {//TODO - get rid of it
	return a * a;
}

/** 
	@param {number} min
	@param {number} max
	@param {number} a
	@returns {number}
*/
export function Clamp(min, max, a) {
	if (a < min) return min;
	if (a > max) return max;
	return a;
}

export function Round(a) {
	return (a + 0.5)|0;
}

export function Random(l, h) {
	let a = Math.random();
	a = (h - l) * a + l;
	return a;
}

/** 
	@param {number} a
	@param {number} b
	@returns {boolean}
*/
export function BiasGreaterThan(a, b) {
	const k_biasRelative = 0.95;
	const k_biasAbsolute = 0.01;
	return a >= b * k_biasRelative + a * k_biasAbsolute;
}