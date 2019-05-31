//@ts-check
import {Circle, Rect, Body} from './body';
import {checkCollision} from './collision';
import Contact from './contact';
import CollisionListener from './collision_listener';
import Config from './../config';

const RANGE_LEN = Config.MAX_RANGE*2;

let CHUNK_SIZE = 2;
//making sure Config.MAX_RANGE*2 is divisable by CHUNK_SIZE
CHUNK_SIZE = RANGE_LEN / Math.round((RANGE_LEN) / CHUNK_SIZE);

export default class Engine {
	constructor() {
		/** @type {Body[]} */
		this._bodies = [];

		/** @type {CollisionListener | null} */
		this.listener = null;

		this.chunks_size = (RANGE_LEN) / CHUNK_SIZE;
		/** @type {Body[][][]} collisions grid for physic bodies array */
		this.chunks = [];//new Array(this.chunks_size).fill(0).map(row => new Array(this.chunks_size));

		console.log(`Map is divided for collision chunks of size: ${CHUNK_SIZE}x${CHUNK_SIZE}`);
	}

	/** @param {CollisionListener} listener */
	assignCollisionListener(listener) {
		this.listener = listener;
	}

	removeObjects() {
		this._bodies = [];
		this.chunks = [];
	}

	/** @param {Body} body */
	removeObject(body) {
		let i = this._bodies.indexOf(body);
		if(i !== -1) {
			this._bodies.splice(i, 1);

			for(let x in this.chunks) {
				for(let y in this.chunks[x]) {
					let j = this.chunks[x][y].indexOf(body);
					if(j !== -1) {
						this.chunks[x][y].splice(j, 1);
						return;
					}
				}
			}
		}
	}

	_getChunkI(pos) {
		return ((pos/Config.SCALLER+Config.MAX_RANGE) / RANGE_LEN * this.chunks_size)|0;
	}

	/** 
	 * @param {Body} body
	 * @param {Body[][][]} chunks_array
	 */
	_push_to_chunks(body, chunks_array) {
		let x_i = this._getChunkI(body.pos.x),
			y_i = this._getChunkI(body.pos.y);
		//if body is out of range
		if(x_i < 0 || x_i >= this.chunks_size || y_i < 0 || y_i >= this.chunks_size) {
			//debugger;
			return;
		}
		let row = chunks_array[x_i];
		if(!row) {
			row = [];
			chunks_array[x_i] = row;
		}
		let col = row[y_i];
		if(!col) {
			col = [];
			row[y_i] = col;
		}
		col.push(body);
	}

	/** @param {Body} body */
	_push_body(body) {
		this._bodies.push(body);
		this._push_to_chunks(body, this.chunks);
	}

	/** 
	* 	@param {number} radius 
	*/
	createCircle(radius) {
		let body = new Circle(radius);
		this._push_body(body);
		return body;
	}

	/** 
	* 	@param {number} width
	* 	@param {number} height
	*/
	createRect(width, height) {
		let body = new Rect(width, height);
		this._push_body(body);
		return body;
	}

	update() {
		//check for collisions
		/** @type {Contact[]} */
		let contacts = [];
		/*for(var i=0; i<this._bodies.length; i++) {
			if(this._bodies[i].mask === 0)//ghost object
				continue;
			for(var j=0; j<this._bodies.length; j++) {
				if(i == j || this._bodies[i].static)//check for static body to optimize
					continue;//ignore same objects
				let c = checkCollision(this._bodies[i], this._bodies[j]);
				if(c !== null)
					contacts.push(c);
			}
		}*/

		//console.time('checking_collisions');
		/** @type {Body[][][]} collisions grid for physic bodies array */
		let next_chunks = [];

		for(let x in this.chunks) {
			for(let y in this.chunks[x]) {
				for(let body of this.chunks[x][y]) {
					this._push_to_chunks(body, next_chunks);

					let sizer = Math.ceil( body.max_size / (CHUNK_SIZE*Config.SCALLER) );

					//iterate over neighbours
					for(let xx=-sizer; xx<=sizer; xx++) {
						let xxx = parseInt(x) + xx;

						if(!this.chunks[xxx])
							continue;

						for(let yy=-sizer; yy<=sizer; yy++) {
							let yyy = parseInt(y) + yy;

							if(!this.chunks[xxx][yyy])
								continue;

							for(let n_body of this.chunks[xxx][yyy]) {
								//check for same, static or ghost body to optimize
								if(body === n_body || n_body.static || n_body.mask === 0)
									continue;
								let c = checkCollision(n_body, body);
								if(c !== null)
									contacts.push(c);
							}
						}
					}
				}
			}
		}

		this.chunks = next_chunks;
		//console.timeEnd('checking_collisions');

		//solving contacts
		for(let contact of contacts) {
			if(this.listener)
				this.listener.onCollision(contact.A, contact.B);
			contact.solve();
		}

		//update each body
		for(let body of this._bodies)
			body.update();

		//resolve collisions
		for(let contact of contacts)
			contact.fixCollision();
	}
}