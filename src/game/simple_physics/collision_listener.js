//@ts-check
import {Body} from './body';

//abstract class
export default class CollisionListener {
	constructor() {}

	/**
	*	@param {Body} A
	*	@param {Body} B
	*/
	onCollision(A, B) {
		throw new Error('Method must be implemented in child class');
	}
}