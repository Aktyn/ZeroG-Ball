// @ts-check
var _enum_ = obj => Object.keys(obj).forEach((k, i) => obj[k] = i);

const SHAPE_TYPE = {//enumerator
	RECT: 0,
	CIRCLE: 0
};
_enum_(SHAPE_TYPE);
// console.log(SHAPE_TYPE);

const PHYSIC_TYPE = {
	STATIC: 0,
	DYNAMIC: 0
};
_enum_(PHYSIC_TYPE);

const HISTORY_CAPACITY = 32;

/**
* 	@typedef {{
		shape_type: number,
		physic_type?: number,
		x?: number, y?: number, 
		w?: number, h?: number, 
		rot?: number
	}} 
	ObjectSchema
*/

/**
*	@typedef {{
		objects: ObjectSchema[]
	}} State
*/

class MapData {
	constructor() {
		/** @type {State} */
		this.state = {
			objects: []
		}

		/** @type {State[]} */
		this.history = [];

		//temp
		this.addObject({shape_type: SHAPE_TYPE.CIRCLE, physic_type: PHYSIC_TYPE.DYNAMIC, x: 0.01, y: -0.8, w: 0.1, h: 0.1});
		this.addObject({shape_type: SHAPE_TYPE.CIRCLE, x: -0.7, y: 0.2, w: 0.2, h: 0.2});
		this.addObject({shape_type: SHAPE_TYPE.CIRCLE, x: 0, y: 0.5, w: 0.2, h: 0.2});
		this.addObject({shape_type: SHAPE_TYPE.CIRCLE, x: 0.5, y: 0.5, w: 0.2, h: 0.2});
		this.addObject({shape_type: SHAPE_TYPE.CIRCLE, x: 1, y: 0.5, w: 0.2, h: 0.2});
		this.addObject({shape_type: SHAPE_TYPE.RECT, physic_type: PHYSIC_TYPE.STATIC, x: 0, y: 0.85, w: 0.8, h: 0.1, rot: Math.PI*0.02});
		/*this.addObject({shape_type: SHAPE_TYPE.RECT, physic_type: PHYSIC_TYPE.STATIC, x: 0, y: 0.9, w: 1, h: 0.1, rot: Math.PI*0});
		this.addObject({shape_type: SHAPE_TYPE.RECT, physic_type: PHYSIC_TYPE.STATIC, x: -1.1, y: 0, w: 1, h: 0.1, rot: Math.PI/2});
		this.addObject({shape_type: SHAPE_TYPE.RECT, physic_type: PHYSIC_TYPE.STATIC, x: 1.1, y: 0, w: 1, h: 0.1, rot: Math.PI/2});
		//this.addObject({shape_type: SHAPE_TYPE.RECT, x: 0.99, y: -0.1, w: 0.8, h: 0.1, rot: Math.PI*0.5});*/
	}

	pushHistory() {
		this.history.push(JSON.parse(JSON.stringify(this.state)));//stores copy
		if(this.history.length > HISTORY_CAPACITY)
			this.history.shift();
	}


	/** @param {ObjectSchema} schema */
	addObject(schema) {
		this.pushHistory();
		this.state.objects.push(schema);
	}

	removeAll() {
		this.pushHistory();
		this.state.objects = [];
	}

	getObjects() {
		return this.state.objects;
	}

	undo() {
		if(this.history.length === 0)
			return false;

		this.state = this.history.pop();

		return true;
	}

	export() {
		return JSON.stringify(this.state);
	}

	/** @param {string} data */
	import(data) {
		this.pushHistory();
		this.state = JSON.parse(data);
	}
}

MapData.SHAPE_TYPE = SHAPE_TYPE;
MapData.PHYSIC_TYPE = PHYSIC_TYPE;

export default MapData;