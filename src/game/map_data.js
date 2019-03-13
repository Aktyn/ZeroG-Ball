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

class MapData {
	constructor() {
		/** @type {ObjectSchema[]} */
		this._objects = [];

		//temp
		this.addObject({shape_type: SHAPE_TYPE.CIRCLE, physic_type: PHYSIC_TYPE.DYNAMIC, 
			x: 0, y: -0.9, w: 0.1, h: 0.1});
		this.addObject({shape_type: SHAPE_TYPE.RECT, x: 0, y: 0.5, w: 0.8, h: 0.1, rot: Math.PI*0.02});
		this.addObject({shape_type: SHAPE_TYPE.RECT, x: 0.99, y: -0.1, w: 0.8, h: 0.1, rot: Math.PI*0.5});
	}


	/** @param {ObjectSchema} schema */
	addObject(schema) {
		this._objects.push(schema);
	}

	getObjects() {
		return this._objects;
	}
}

MapData.SHAPE_TYPE = SHAPE_TYPE;
MapData.PHYSIC_TYPE = PHYSIC_TYPE;

export default MapData;