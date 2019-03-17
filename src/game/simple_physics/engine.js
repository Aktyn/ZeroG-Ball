// @ts-check
import {Circle, Rect, Body} from './body';
import {checkCollision} from './collision';
import Contact from './contact';
import Config from './../config';

export default class Engine {
	constructor() {
		/** @type {Body[]} */
		this.bodies = [];
	}

	removeObjects() {
		this.bodies = [];
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
				if(i == j)
					continue;//ignore same objects
				let c = checkCollision(this.bodies[i], this.bodies[j]);
				if(c !== null)
					contacts.push(c);
			}
		}

		//solving contacts
		//for(var j=0; j<Config.ITERATIONS; j++) {
			for(let contact of contacts) {
				//contact.solveIteration();
				contact.solve();
			}
		//}

		for(let body of this.bodies) {
			body.update();
		}


		for(let contact of contacts) {
			contact.fixCollision();
		}
	}
}