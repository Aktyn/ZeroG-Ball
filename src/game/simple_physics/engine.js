//@ts-check
import {Circle, Rect, Body} from './body';
import {checkCollision} from './collision';
import Contact from './contact';
import CollisionListener from './collision_listener';
import Config from './../config';

export default class Engine {
	constructor() {
		/** @type {Body[]} */
		this.bodies = [];

		/** @type {CollisionListener | null} */
		this.listener = null;
	}

	/** @param {CollisionListener} listener */
	assignCollisionListener(listener) {
		this.listener = listener;
	}

	removeObjects() {
		this.bodies = [];
	}

	/** @param {Body} body */
	removeObject(body) {
		let i = this.bodies.indexOf(body);
		if(i !== -1)
			this.bodies.splice(i, 1);
	}

	/** 
	* 	@param {number} radius 
	*/
	createCircle(radius) {
		let body = new Circle(radius);
		this.bodies.push(body);
		return body;
	}

	/** 
	* 	@param {number} width
	* 	@param {number} height
	*/
	createRect(width, height) {
		let body = new Rect(width, height);
		this.bodies.push(body);
		return body;
	}

	update() {
		//update each body
		/*for(let body of this.bodies) {
			body.update();
		}*/
		
		//check for collisions
		/** @type {Contact[]} */
		let contacts = [];
		for(var i=0; i<this.bodies.length; i++) {
			for(var j=0; j<this.bodies.length; j++) {
				if(i == j || this.bodies[i].static)//check for static body to optimize
					continue;//ignore same objects
				let c = checkCollision(this.bodies[i], this.bodies[j]);
				if(c !== null)
					contacts.push(c);
			}
		}

		//solving contacts
		for(let contact of contacts) {
			if(this.listener)
				this.listener.onCollision(contact.A, contact.B);
			contact.solve();
		}

		for(let body of this.bodies) {
			body.update();
		}


		for(let contact of contacts) {
			contact.fixCollision();
		}
	}
}