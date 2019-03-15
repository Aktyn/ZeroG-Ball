//@ts-check
import {Body, Circle, Rect, ShapeType} from './body';
import {Vec2} from './math';
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
	throw new Error('Function not yet implemented');
}

/**
* @param {Circle} circle
* @param {Rect} rect
*/
function circleToRect(circle, rect) {

}

/**
* @param {Rect} rect
* @param {Circle} circle
*/
function rectToCircle(rect, circle) {
	return circleToRect(circle, rect);
}