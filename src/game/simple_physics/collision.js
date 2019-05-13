//@ts-check
import {Body, Circle, Rect, ShapeType} from './body';
import {Vec2, distanceToLineSegment, dotProduct} from './math';
import Contact from './contact';

const collisionCases = [
	[circleToCircle, circleToRect],
	[rectToCircle, rectToRect]
];

/**
* @param {Body} A
* @param {Body} B
* @returns {Contact | null}
*/
export function checkCollision(A, B) {
	//@ts-ignore
	return collisionCases[A.shape_type][B.shape_type](A, B);
}

/**
* @param {Circle} circle1
* @param {Circle} circle2
*/
function circleToCircle(circle1, circle2) {
	//distance between circles <= sum of radiuses
	let overlap = circle1.radius + circle2.radius - circle1.pos.distanceToVec(circle2.pos);
	if( overlap > 0 ) {
		let contact_point = circle2.pos.clone().substractVec(circle1.pos).normalize()
			.scale(circle1.radius - overlap/2).addVec(circle1.pos);
		return new Contact(circle1, circle2, contact_point, overlap);
	}
	else
		return null;//no collision
}

/**
* @param {Rect} rect1
* @param {Rect} rect2
*/
function rectToRect(rect1, rect2) {
	return null;
}

/**
* @param {Circle} circle
* @param {Rect} rect
*/
function circleToRect(circle, rect, flip = false) {
	//calculating verticle positions of rectangle
	// 0 1
	// 3 2   y axis goes down
	let v = [
		new Vec2(-rect.width, -rect.height).rotate(rect.rot).addVec(rect.pos),
		new Vec2(rect.width, -rect.height).rotate(rect.rot).addVec(rect.pos),
		new Vec2(rect.width, rect.height).rotate(rect.rot).addVec(rect.pos),
		new Vec2(-rect.width, rect.height).rotate(rect.rot).addVec(rect.pos)
	];

	//TODO - calculate minimum bounding rectangle from rotated points and check for not intersecting
	//for better performance //(calculations may be done in Rect.update method)
	let projection = new Vec2();
	for(let i=0; i<v.length; i++) {
		let p1 = v[i];
		let p2 = v[(i+1) < v.length ? (i+1) : 0];

		let overlap = circle.radius - distanceToLineSegment(circle.pos, p1, p2, projection);

		if( overlap > 0 ) {
			//check for edge normal
			let edge_norm = p1.clone().addVec(p2).scale(0.5).substractVec(rect.pos).normalize();
			let bounce_norm = circle.pos.clone().substractVec(projection).normalize();
			if( dotProduct(edge_norm, bounce_norm) < -0.5 )//if circle gets trapped inside a rect then ...
				overlap = -overlap - circle.radius;//...reverse bounce vector so it can escape
			// debugger;
			if(flip)
				return new Contact(rect, circle, projection, overlap);
			else
				return new Contact(circle, rect, projection, overlap);
		}
	}

	return null;
}

/**
* @param {Rect} rect
* @param {Circle} circle
*/
function rectToCircle(rect, circle) {
	//Tflip objects while returning contact
	return circleToRect(circle, rect, true);
}