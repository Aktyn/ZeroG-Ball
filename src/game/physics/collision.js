import Config from './../config';
import Manifold from './manifold';
import Body from './body';
import {Vec2, Mat2, Dot, DistSqr, BiasGreaterThan} from './math';

import {Circle, PolygonShape} from './shape';

export const Dispatch = [
	[circletoCircle, circletoPolygon],
	[polygontoCircle, polygontoPolygon]
];

/**
*	@param {Manifold} m
*	@param {Body} a
*	@param {Body} b
*/
function circletoCircle(m, a, b) {
	/** @type {Circle} */
	let A = a.shape;
	/** @type {Circle} */
	let B = b.shape;

	// Calculate translational vector, which is normal
	let normal = new Vec2(b.position.x - a.position.x, b.position.y - a.position.y);

	let dist_sqr = normal.LenSqr();
	let radius = A.radius + B.radius;

	// Not in contact
	if(dist_sqr >= radius * radius) {
		m.contact_count = 0;
		return;
	}

	let distance = Math.sqrt( dist_sqr );

	m.contact_count = 1;

	if(distance === 0) {
		m.penetration = A.radius;
		m.normal = Vec2( 1, 0 );
		m.contacts [0] = a.position;
	}
	else
	{
		m.penetration = radius - distance;
		m.normal = normal / distance;//faster calculations
		m.contacts[0] = m.normal * A.radius + a.position;
	}
}

/**
*	@param {Manifold} m
*	@param {Body} a
*	@param {Body} b
*/
function circletoPolygon(m, a, b) {
	/** @type {Circle} */
	let A = a.shape;
	/** @type {PolygonShape} */
	let B = b.shape;

	m.contact_count = 0;

	// Transform circle center to Polygon model space
	//let center = a.position;
	//center = B.u.Transpose() * (center - b.position);
	let center = B.u.Transpose().multiplyByVec(
		new Vec2(a.position.x - b.position.x, a.position.y - b.position.y)
	);

	// Find edge with minimum penetration
	// Exact concept as using support points in Polygon vs Polygon
	let separation = -FLT_MAX;
	let faceNormal = 0;//TODO - optimize by using var
	for(let i = 0; i < B.m_vertices.length; i++) {
		let s = Dot( B.m_normals[i], center - B.m_vertices[i] );

		if(s > A.radius)
			return;

		if(s > separation) {
			separation = s;
			faceNormal = i;
		}
	}

	// Grab face's vertices
	let v1 = B.m_vertices[faceNormal].clone();
	let i2 = faceNormal + 1 < B.m_vertices.length ? faceNormal + 1 : 0;
	let v2 = B.m_vertices[i2].clone();

	// Check to see if center is within polygon
	if(separation < Config.EPSILON) {
		m.contact_count = 1;
		//m.normal = -(B.u * B.m_normals[faceNormal]);
		m.normal = B.u.multiplyByVec(B.m_normals[faceNormal]).minus();
		// m.contacts[0] = m.normal * A.radius + a.position;
		m.contacts[0] = m.normal.clone().scale(A.radius).addVec(a.position);
		m.penetration = A.radius;
		return;
	}

	// Determine which voronoi region of the edge center of circle lies within
	//let dot1 = Dot( center - v1, v2 - v1 );
	let dot1 = Dot(
		new Vec2(center.x-v1.x, center.y-v1.y),
		new Vec2(v2.x-v1.x, v2.y-v1.y)
	);
	//let dot2 = Dot( center - v2, v1 - v2 );
	let dot2 = Dot(
		new Vec2(center.x-v2.x, center.y-v2.y),
		new Vec2(v1.x-v2.x, v1.y-v2.y)
	);
	m.penetration = A.radius - separation;

	// Closest to v1
	if(dot1 <= 0) {
		if(DistSqr( center, v1 ) > A.radius * A.radius)
			return;

		m.contact_count = 1;
		//Vec2 n = v1 - center;
		let n = v1.clone().substractVec(center);
		n = B.u.multiplyByVec(n).Normalize();//B.u * n;
		m.normal = n;
		v1 = B.u.multiplyByVec(v1).addVec(b.position);//B.u * v1 + b.position;
		m.contacts[0] = v1;
	}
	else if(dot2 <= 0.) {// Closest to v2
		if(DistSqr( center, v2 ) > A.radius * A.radius)
			return;

		m.contact_count = 1;
		let n = v2.clone().substractVec(center);
		v2 = B.u.multiplyByVec(v2).addVec(b.position);//B.u * v2 + b.position;
		m.contacts[0] = v2;
		n = B.u.multiplyByVec(n).Normalize();//B.u * n;
		m.normal = n;
	}
	else {//closest to face
		let n = B.m_normals[faceNormal];
		if(Dot( center.clone().substractVec(v1), n ) > A.radius)
			return;

		n = B.u.multiplyByVec(n);//B.u * n;
		m.normal = n.clone().minus();
		//m.contacts[0] = m.normal * A.radius + a.position;
		m.contacts[0] = m.normal.clone().scale(A.radius).addVec(a.position);
		m.contact_count = 1;
	}
}

/**
*	@param {Manifold} m
*	@param {Body} a
*	@param {Body} b
*/
function polygontoCircle(m, a, b) {
	circletoPolygon(m, b, a);
	//m.normal = -m.normal;
	m.normal.minus();
}

/**
*	@param {number} faceIndex
*	@param {PolygonShape} A
*	@param {PolygonShape} B
*/
function findAxisLeastPenetration(A, B) {
	let bestDistance = Number.MIN_SAFE_INTEGER;
	/** @type {number} */
	let bestIndex;

	for(let i = 0; i < A.m_vertices.length; i++) {
		// Retrieve a face normal from A
		let n = A.m_normals[i];
		let nw = A.u.multiplyByVec(n);

		// Transform face normal into B's model space
		let buT = B.u.Transpose();
		n = buT.multiplyByVec(nw);

		// Retrieve support point from B along -n
		let s = B.getSupport( n.clone().minus() );

		// Retrieve vertex on face from A, transform into
		// B's model space
		let v = A.m_vertices[i];
		v = A.u.multiplyByVec(v).addVec(A.body.position);//A.u * v + A.body.position;
		//v -= B.body.position;
		v.substractVec(B.body.position);
		v = buT.multiplyByVec(v);//buT * v;

		// Compute penetration distance (in B's model space)
		let d = Dot( n, s.clone().substractVec(v) );//TODO - try without cloning

		// Store greatest distance
		if(d > bestDistance) {
			bestDistance = d;
			bestIndex = i;
		}
	}

	//*faceIndex = bestIndex;
	return {
		best_distance: bestDistance,
		faceIndex: bestIndex
	};
}

/** 
* @param {Vec2[]} v
* @param {PolygonShape} RefPoly
* @param {PolygonShape} IncPoly
* @param {number} referenceIndex
*/
function findIncidentFace(v, RefPoly, IncPoly, referenceIndex) {
	let referenceNormal = RefPoly.m_normals[referenceIndex];

	// Calculate normal in incident's frame of reference
	//referenceNormal = RefPoly.u * referenceNormal; // To world space
	referenceNormal = RefPoly.u.multiplyByVec(referenceNormal);
	//referenceNormal = IncPoly.u.Transpose( ) * referenceNormal; // To incident's model space
	referenceNormal = IncPoly.u.Transpose().multiplyByVec(referenceNormal);

	// Find most anti-normal face on incident polygon
	let incidentFace = 0;
	let minDot = Number.MAX_SAFE_INTEGER;
	for(let i = 0; i < IncPoly.m_vertices.length; i++) {
		let dot = Dot( referenceNormal, IncPoly.m_normals[i] );
		if(dot < minDot) {
			minDot = dot;
			incidentFace = i;
		}
	}

	// Assign face vertices for incidentFace
	//v[0] = IncPoly.u * IncPoly.m_vertices[incidentFace] + IncPoly.body.position;
	v[0] = IncPoly.u.multiplyByVec(IncPoly.m_vertices[incidentFace]).addVec(IncPoly.body.position);
	incidentFace = incidentFace + 1 >= IncPoly.m_vertices.length ? 0 : incidentFace + 1;
	//v[1] = IncPoly.u * IncPoly.m_vertices[incidentFace] + IncPoly.body.position;
	v[1] = IncPoly.u.multiplyByVec(IncPoly.m_vertices[incidentFace]).addVec(IncPoly.body.position);
}

/** 
* @param {Vec2} n
* @param {number} c
* @param {Vec2[]} face
* @returns {number}
*/
function clip(n, c, face) {// Vec2 n, let c, Vec2 *face 
	let sp = 0;
	let out = [
		face[0].clone(),
		face[1].clone()
	];

	// Retrieve distances from each endpoint to the line
	// d = ax + by - c
	let d1 = Dot( n, face[0] ) - c;
	let d2 = Dot( n, face[1] ) - c;

	// If negative (behind plane) clip
	if(d1 <= 0) out[sp++] = face[0];
	if(d2 <= 0) out[sp++] = face[1];
	
	// If the points are on different sides of the plane
	if(d1 * d2 < 0) { // less than to ignore -0.0f
		// Push interesection point
		let alpha = d1 / (d1 - d2);
		//out[sp] = face[0] + alpha * (face[1] - face[0]);
		out[sp] = face[0].clone().addVec(
			new Vec2(face[1].x-face[0].x, face[1].y-face[0].y).scale(alpha)
		);
		++sp;
	}

	// Assign our new converted values
	face[0] = out[0];
	face[1] = out[1];

	if( sp === 3 )
		throw new Error('sp cannot be equal to 3');

	return sp;
}

/**
*	@param {Manifold} m
*	@param {Body} a
*	@param {Body} b
*/
function polygontoPolygon(m, a, b) {
	/** @type {PolygonShape} */
	let A = a.shape;
	/** @type {PolygonShape} */
	let B = b.shape;

	m.contact_count = 0;

	// Check for a separating axis with A's face planes
	//let faceA;
	let penetrationA = findAxisLeastPenetration(A, B);
	if(penetrationA.best_distance >= 0)
		return;

	// Check for a separating axis with B's face planes
	let penetrationB = findAxisLeastPenetration(B, A);
	if(penetrationB >= 0)
		return;

	/** @type {number} */
	let referenceIndex;
	/** @type {boolean} */
	let flip; // Always point from a to b

	/** @type {PolygonShape} */
	let RefPoly; // Reference
	/** @type {PolygonShape} */
	let IncPoly; // Incident

	// Determine which shape contains reference face
	if(BiasGreaterThan( penetrationA.best_distance, penetrationB.best_distance )) {
		RefPoly = A;
		IncPoly = B;
		referenceIndex = penetrationA.faceIndex;
		flip = false;
	}
	else {
		RefPoly = B;
		IncPoly = A;
		referenceIndex = penetrationB.faceIndex;
		flip = true;
	}

	// World space incident face
	let incidentFace = [new Vec2(), new Vec2()];
	findIncidentFace(incidentFace, RefPoly, IncPoly, referenceIndex);

	//        y
	//        ^  .n       ^
	//      +---c ------posPlane--
	//  x < | i |\
	//      +---+ c-----negPlane--
	//             \       v
	//              r
	//
	//  r : reference face
	//  i : incident poly
	//  c : clipped point
	//  n : incident normal

	// Setup reference face vertices
	let v1 = RefPoly.m_vertices[referenceIndex];
	referenceIndex = referenceIndex + 1 == RefPoly.m_vertexCount ? 0 : referenceIndex + 1;
	let v2 = RefPoly.m_vertices[referenceIndex];

	// Transform vertices to world space
	//v1 = RefPoly.u * v1 + RefPoly.body.position;
	v1 = RefPoly.u.multiplyByVec(v1).addVec(RefPoly.body.position);
	//v2 = RefPoly.u * v2 + RefPoly.body.position;
	v2 = RefPoly.u.multiplyByVec(v2).addVec(RefPoly.body.position);

	// Calculate reference face side normal in world space
	let sidePlaneNormal = v2.clone().substractVec(v1).Normalize();//(v2 - v1);

	// Orthogonalize
	//Vec2 refFaceNormal( sidePlaneNormal.y, -sidePlaneNormal.x );
	let refFaceNormal = new Vec2(sidePlaneNormal.y, -sidePlaneNormal.x);

	// ax + by = c
	// c is distance from origin
	let refC = Dot( refFaceNormal, v1 );
	let negSide = -Dot( sidePlaneNormal, v1 );
	let posSide =  Dot( sidePlaneNormal, v2 );

	// Clip incident face to reference face side planes
	if(clip( sidePlaneNormal.clone().minus(), negSide, incidentFace ) < 2)
		return; // Due to floating point error, possible to not have required points

	if(clip( sidePlaneNormal, posSide, incidentFace ) < 2)
		return; // Due to floating point error, possible to not have required points

	//flip
	m.normal = flip ? refFaceNormal.clone().minus() : refFaceNormal.clone();

	// Keep points behind reference face
	let cp = 0; // clipped points behind reference face
	let separation = Dot( refFaceNormal, incidentFace[0] ) - refC;
	if(separation <= 0) {
		m.contacts[cp] = incidentFace[0].clone();
		m.penetration = -separation;
		++cp;
	}
	else
		m.penetration = 0;

	separation = Dot( refFaceNormal, incidentFace[1] ) - refC;
	if(separation <= 0) {
		m.contacts[cp] = incidentFace[1];

		m.penetration += -separation;
		++cp;

		// Average penetration
		m.penetration /= cp;
	}

	m.contact_count = cp;
}