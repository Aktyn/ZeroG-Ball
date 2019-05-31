// @ts-check
import Object2D, {Type} from './objects/object2d';

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
 * @param  {number}
 * @param  {number}
 * @return {Boolean}
 */
function isEqual(a, b) {
	return Math.abs(a - b) < 1 / 2048;//equal numbers with some precision
}

/**
 * @param  {number}
 * @return {number}
 */
function fixRot(rot) {
	while(rot >= Math.PI*2) rot -= Math.PI*2;
	while(rot < 0) rot += Math.PI*2;
	return rot;
}

/**
* 	@typedef {{
		x: number, y: number, 
		w: number, h: number, 
		rot: number,
	}} 
	Transform
*/

/**
* 	@typedef {{
		shape_type: number,
		physic_type?: number,
		x?: number, y?: number, 
		w?: number, h?: number, 
		rot?: number,
		keyframes: {time: number, transform: Transform}[],
		class_name?: string
	}} 
	ObjectSchema
*/

/**
*	@typedef {{
		background: number,
		objects: ObjectSchema[]
	}} State
*/

const empty_map = {"background":0,"objects":[]};


/** @type {{name: string, json: State}[]} */
export const AVAILABLE_MAPS = [//NOTE - names should be unique
	{
		name: 'Wprowadzenie',
		//@ts-ignore
		json: require('./../maps/1.json') 
	},
	{
		name: 'Pierwsze starcie',
		//@ts-ignore
		json: require('./../maps/2.json') 
	}
];

class MapData {
	/**
	 * @param  {{name: string, json: State}} map_data
	 */
	constructor(map_data = undefined) {
		/** @type {State} */
		this.state = {
			background: 0,
			objects: []
		}

		this.name = (map_data && map_data.name) || 'Unknown map name';

		/** @type {State[]} */
		this.history = [];

		this.import(JSON.parse(JSON.stringify( (map_data && map_data.json) || empty_map )), true);
	}

	pushHistory() {
		this.history.push(JSON.parse(JSON.stringify(this.state)));//stores copy
		if(this.history.length > HISTORY_CAPACITY)
			this.history.shift();
	}

	get wasEdited() {
		return this.history.length > 0;
	}

	/** @param {ObjectSchema | Object2D} schema */
	addObject(schema) {
		this.pushHistory();

		if(schema instanceof Object2D) {
			this.state.objects.push({
				'shape_type': schema.type === Type.CIRCLE ? SHAPE_TYPE.CIRCLE : SHAPE_TYPE.RECT,
				'physic_type': schema.static ? PHYSIC_TYPE.STATIC : PHYSIC_TYPE.DYNAMIC,
				'x': schema.transform.x, y: schema.transform.y, 
				'w': schema.transform.w, h: schema.transform.h, 
				'rot': schema.transform.rot,
				'keyframes': schema.keyframes,
				'class_name': schema.getClassName()
			});
		}
		else
			this.state.objects.push(schema);
	}

	removeAll() {
		this.pushHistory();
		this.state.objects = [];
	}

	/**
	* @param {Object2D} obj
	* @param {Transform} transform
	*/
	updateObjectTransform(obj, transform) {
		let schema = this.findSchema(obj);

		if(schema) {
			this.pushHistory();
			Object.assign(schema, transform);
			return true;
		}
		return false;
	}

	/**
	* @param {Object2D} obj
	* @param {{time: number, transform: Transform}[]} keyframes
	*/
	updateObjectKeyframes(obj, keyframes) {
		let schema = this.findSchema(obj);

		if(schema) {
			this.pushHistory();
			schema.keyframes = JSON.parse(JSON.stringify(keyframes));
			return true;
		}
		return false;
	}

	/**
	* @param {Object2D} obj
	*/
	deleteObject(obj) {
		let schema = this.findSchema(obj);

		if(schema) {
			let schema_i = this.state.objects.indexOf(schema);
			if(schema_i === -1)
				return false;
			this.pushHistory();
			this.state.objects.splice(schema_i, 1);

			return true;
		}
		return false;
	}

	/** @param {number} id */
	selectBackground(id) {
		this.pushHistory();
		this.state.background = id;
	}

	/**
	* @param {Object2D} obj
	*/
	findSchema(obj) {
		for(let schema of this.state.objects) {
			if( isEqual(schema.x||0, obj.transform.x||0) &&
				isEqual(schema.y||0, obj.transform.y||0) &&
				( isEqual(fixRot(schema.rot||0), fixRot(obj.transform.rot||0)) || 
					schema.shape_type===SHAPE_TYPE.CIRCLE) &&
				isEqual(schema.w||0, obj.transform.w||0) &&
				isEqual(schema.h||0, obj.transform.h||0) &&
				(schema.class_name === undefined || obj.getClassName().includes(schema.class_name))
			) return schema;
		}
		return null;
	}

	getObjects() {
		return this.state.objects;
	}

	getBackgroundID() {
		return this.state.background;
	}

	/**
	 * @return {boolean}
	 */
	undo() {
		if(this.history.length === 0)
			return false;

		this.state = this.history.pop();

		return true;
	}

	/**
	 * @return {string}
	 */
	export() {
		return JSON.stringify(this.state);
	}

	/** @param {string|State} data */
	import(data, ignore_history = false) {
		if(!ignore_history)
			this.pushHistory();
		if(typeof data === 'string')
			this.state = JSON.parse(data);
		else
			this.state = data;
	}
}

MapData.SHAPE_TYPE = SHAPE_TYPE;
MapData.PHYSIC_TYPE = PHYSIC_TYPE;

export default MapData;