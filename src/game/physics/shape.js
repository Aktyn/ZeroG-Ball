// @ts-check
import Body from './body';
import {Mat2, Vec2, CrossVV, Dot} from './math';
import Config from './../config';

const MaxPolyVertexCount = 64;

const Type = {//the numbers are important
	eCircle: 0,
	ePoly: 1,
	eCount: 2,
};

export default class Shape {
	constructor() {
		this.radius = 1;
		/** @type {Body} */
		this.body = null;
		this.u = new Mat2({radians: 0});
	}

	clone() {}
	initialize() {}
	computeMass(density) {}
	/** @param {number} radians */
	setOrient(radians) {}
	draw() {}
	getType() {}
}

export class Circle extends Shape {
	constructor(radius) {
		super();
		this.radius = radius;
	}

	/** @returns {Circle} */
	clone() {
		return new Circle(this.radius);
	}

	initialize() {
		this.computeMass(1);
	}

	computeMass(density) {
		this.body.m = Math.PI * this.radius * this.radius * density;
		this.body.im = (this.body.m) ? 1 / this.body.m : 0;
		this.body.I = this.body.m * this.radius * this.radius;
		this.body.iI = (this.body.I) ? (1.0 / this.body.I) : 0;
	}

	//setOrient( let radians ) {}//no need to rotate a circle

	getType() {
		return Type.eCircle;
	}
}

export class PolygonShape extends Shape {
	constructor() {
		super();
		/** @type {Body} */
		this.body = null;
		this.u = new Mat2();

		//this.m_vertexCount;
		//this.m_vertices[MaxPolyVertexCount];
		//this.m_normals[MaxPolyVertexCount];
		//this.m_vertexCount = 0;

		/** @type {Vec2[]} */
		this.m_vertices = [];
		/** @type {Vec2[]} */
		this.m_normals = [];
	}

	initialize() {
		this.computeMass(1);
	}

	/** @returns {PolygonShape} */
	clone() {
		let poly = new PolygonShape();
		poly.u = this.u;
		for(var i=0; i<this.m_vertices.length; i++) {//m_vertexCount
			//poly.m_vertices[i] = m_vertices[i];
			//poly.m_normals[i] = m_normals[i];
			poly.m_vertices.push( this.m_vertices[i].clone() );
			poly.m_normals.push( this.m_normals[i].clone() );
		}
		//poly.m_vertexCount = this.m_vertexCount;
		return poly;
	}

	computeMass(density) {
		// Calculate centroid and moment of interia
		let c = new Vec2(0, 0);
		let area = 0.0;
		let I = 0.0;
		const k_inv3 = 1.0/3.0;

		for(var i1=0; i1<this.m_vertices.length; i1++) {
			// Triangle vertices, third vertex implied as (0, 0)
			// Vec2 p1( m_vertices[i1] );
			let p1 = this.m_vertices[i1].clone();
			let i2 = i1 + 1 < this.m_vertices.length ? (i1 + 1) : 0;
			let p2 = this.m_vertices[i2].clone();

			let D = CrossVV( p1, p2 );
			let triangleArea = 0.5 * D;

			area += triangleArea;

			// Use area to weight the centroid average, not just vertex position
			//c += triangleArea * k_inv3 * (p1 + p2);
			c.addVec( p1.clone().addVec(p2).scale(triangleArea*k_inv3) );

			let intx2 = p1.x * p1.x + p2.x * p1.x + p2.x * p2.x;
			let inty2 = p1.y * p1.y + p2.y * p1.y + p2.y * p2.y;
			I += (0.25 * k_inv3 * D) * (intx2 + inty2);
		}

		//c *= 1.0 / area;
		c.scale(1.0 / area);

		// Translate vertices to centroid (make the centroid (0, 0)
		// for the polygon in model space)
		// Not really necessary, but I like doing this anyway
		for(var i = 0; i<this.m_vertices.length; i++)
			this.m_vertices[i].substractVec(c);//.add(-c);
			//this.m_vertices[i] -= c;

		if(!this.body)
			throw new Error('No body assigned to this shape');
		this.body.m = density * area;
		this.body.im = this.body.m ? (1.0 / this.body.m) : 0;
		this.body.I = I * density;
		this.body.iI = this.body.I ? (1.0 / this.body.I) : 0;
	}

	setOrient(radians) {
		this.u.setRadians( radians );
	}

	getType() {
		return Type.ePoly;
	}

	// Half width and half height
	/**
	* @param {number} hw
	* @param {number} hh
	*/
	setBox(hw, hh) {
		//m_vertexCount = 4;
		while(this.m_vertices.length < 4)
			this.m_vertices.push( new Vec2() );
		this.m_vertices[0].set( -hw, -hh );
		this.m_vertices[1].set(  hw, -hh );
		this.m_vertices[2].set(  hw,  hh );
		this.m_vertices[3].set( -hw,  hh );

		while(this.m_normals.length < 4)
			this.m_normals.push( new Vec2() );
		this.m_normals[0].set(  0.0,  -1.0 );
		this.m_normals[1].set(  1.0,   0.0 );
		this.m_normals[2].set(  0.0,   1.0 );
		this.m_normals[3].set( -1.0,   0.0 );
	}

	/** 
	* @param {Vec2[]} vertices
	*/
	set(vertices) {//count argument removed
		// No hulls with less than 3 vertices (ensure actual polygon)
		//assert( count > 2 && count <= MaxPolyVertexCount );
		vertices.length = Math.min(vertices.length, MaxPolyVertexCount);

		// Find the right most point on the hull
		let rightMost = 0;
		let highestXCoord = vertices[0].x;
		for(var i = 1; i < vertices.length; i++) {
			let x = vertices[i].x;
			if(x > highestXCoord) {
				highestXCoord = x;
				rightMost = i;
			}
			else if(x === highestXCoord)// If matching x then take farthest negative y
				if(vertices[i].y < vertices[rightMost].y)
					rightMost = i;
		}

		let hull = new Array(MaxPolyVertexCount).fill(0);
		let outCount = 0;
		let indexHull = rightMost;

		for (;;) {
			hull[outCount] = indexHull;

			// Search for next index that wraps around the hull
			// by computing cross products to find the most counter-clockwise
			// vertex in the set, given the previos hull index
			let nextHullIndex = 0;
			for(let i = 1; i < (vertices.length|0); i++) {
				// Skip if same coordinate as we need three unique
				// points in the set to perform a cross product
				if(nextHullIndex == indexHull) {
					nextHullIndex = i;
					continue;
				}

				// Cross every set of three unique vertices
				// Record each counter clockwise third vertex and add
				// to the output hull
				// See : http://www.oocities.org/pcgpe/math2d.html
				let e1 = vertices[nextHullIndex].clone().addVec( 
					vertices[hull[outCount]].clone().minus() );
				let e2 = vertices[i].clone().addVec( 
					vertices[hull[outCount]].clone().minus() );
				let c = CrossVV( e1, e2 );
				if(c < 0)
					nextHullIndex = i;

				// Cross product is zero then e vectors are on same line
				// therefor want to record vertex farthest along that line
				if(c === 0 && e2.LenSqr() > e1.LenSqr())
					nextHullIndex = i;
			}

			++outCount;
			indexHull = nextHullIndex;

			// Conclude algorithm upon wrap-around
			if(nextHullIndex === rightMost) {
				//m_vertexCount = outCount;
				break;
			}
		}

		// Copy vertices into shape's vertices
		this.m_vertices = [];
		this.m_normals = [];
		for(let i = 0; i < outCount; ++i) {
			this.m_vertices.push( vertices[hull[i]] );
			this.m_normals.push( new Vec2() );
		}

		// Compute face normals
		for(let i1 = 0; i1 < outCount; ++i1) {
			let i2 = i1 + 1 < outCount ? i1 + 1 : 0;
			let face = this.m_vertices[i2].clone().addVec( this.m_vertices[i1].clone().minus() );

			// Ensure no zero-length edges, because that's bad
			if( face.LenSqr( ) <= Config.EPSILON * Config.EPSILON )
				throw new Error('Incorrect vector length');

			// Calculate normal with 2D cross product between vector and scalar
			this.m_normals[i1] = new Vec2( face.y, -face.x );
			this.m_normals[i1].Normalize();
		}
	}

	// The extreme point along a direction within a polygon
	/** 
	* @param {Vec2} dir
	*/
	getSupport(dir) {
		let bestProjection = Number.MIN_SAFE_INTEGER;//-FLT_MAX;
		/** @type {Vec2} */
		let bestVertex;

		for(let i = 0; i < this.m_vertices.length; i++) {
			let v = this.m_vertices[i];
			let projection = Dot(v, dir);

			if(projection > bestProjection) {
				bestVertex = v;
				bestProjection = projection;
			}
		}

		return bestVertex;
	}
}