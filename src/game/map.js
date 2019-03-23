import MapData from './map_data';
import SvgEngine from './svg_engine';
import Physics from './physics/physics_engine';
import Object2D, {Type} from './objects/object2d';
import {Circle, PolygonShape} from './physics/shape';
import Background from './background';
import Config from './config';

import SimplePhysics from './simple_physics/engine';

// import ball_texture from './../img/ball_texture.png';

// @ts-check

const BG_SMOOTHING = 0.8;
const MAP_SIZE_X = 3;//3;
const MAP_SIZE_Y = 3;//3;
const BG_SCALE = 2;

export default class Map {
	constructor() {
		this.graphics = new SvgEngine();
		this.graphics.foreground_layer.addClass('cartoon-style').addClass('flat-shadows');

		this.paused = false;

		this.camera = {
			x: 0, y: 0, zoom: 1
		};

		this.loadFilters();
		this.loadTextures();

		this.background = new Background(MAP_SIZE_X, MAP_SIZE_Y, BG_SMOOTHING, BG_SCALE);
		
		this.graphics.addBackgroundObjects(//.setSize(0.5, 0.5)
			...this.background.tiles,
		);

		if(Config.PHYSICS_ENGINE === 'advanced')
			this.physics = new Physics();
		else
			this.physics = new SimplePhysics();

		/** @type {Object2D[] */
		this.objects = [];
		//this.loadObjects();
	}

	getNode() {
		return this.graphics.getNode();
	}

	/**
	* @param {number} w
	* @param {number} h
	*/
	onResize(w, h) {
		this.graphics.onResize(w, h);
	}

	/** 
	* Casts coordinates according to current camera zoom and position
	* @param {{x: number, y: number}} coords 
	*/
	castCoords({x, y}) {
		return {
			x: (x - 0.5) * Config.ASPECT * 2 * this.camera.zoom + this.camera.x,
			y: (y - 0.5) * 2 * this.camera.zoom + this.camera.y
		};
	}

	loadFilters() {
		this.graphics.createFilter('flat-shadow', {
				name: 'feOffset',
				attribs: {'result': 'offOut1', 'in': 'SourceGraphic', 'dx': Config.VIRT_SCALE*0.01, 'dy': Config.VIRT_SCALE*0.01}
			}, {
				name: 'feColorMatrix',
				attribs: {'result': "matrixOut", 'in': "offOut", 'type': "matrix", 'values': "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"}
				//0.6 0 0 0 0 0 0.6 0 0 0 0 0 0.6 0 0 0 0 0 1 0
			}, {
				name: 'feBlend',
				attribs: {'result': 'out1', 'in': "SourceGraphic", 'in2': "matrixOut", 'mode': "normal"}
			},
		);
	}

	loadTextures() {//TODO
		/*this.graphics.createTexture('ball-texture', ball_texture, 
			Config.VIRT_SCALE*0.1, Config.VIRT_SCALE*0.1);*/
	}

	/** 
	* Casts coordinates according to current camera zoom and position
	* @param {{x: number, y: number}} coords 
	*/
	addTestCircle({x, y}) {
		let rand_r = Math.random() * 0.1 + 0.05;
		let object2d = new Object2D(Type.CIRCLE, rand_r, rand_r, this.graphics, this.physics)
			.set({'fill': 'rgb(255, 128, 128)'}).setPos(x||0, y||0);
	}

	/** @param {MapData} data*/
	load(data, reset_camera = false) {
		console.log('Loading map data');

		this.graphics.clearForeground();
		this.physics.removeObjects();
		this.objects = [];
		if(reset_camera)
			this.updateCamera(0, 0, 1);//reset camera

		for(let obj of data.getObjects()) {
			let shape = (type => {
				switch(type) {
					case MapData.SHAPE_TYPE.CIRCLE:	return Type.CIRCLE;
					case MapData.SHAPE_TYPE.RECT:	return Type.RECT;
				}
			})(obj.shape_type);

			let object2d = new Object2D(shape, obj.w||1, obj.h||1, this.graphics, this.physics)
				/*.set({'fill': 'rgb(64, 192, 255)'})*/.setPos(obj.x||0, obj.y||0).setRot(obj.rot||0);

			if(obj.class_name)
				object2d.set({'class': obj.class_name});

			if(obj.physic_type === undefined || obj.physic_type === MapData.PHYSIC_TYPE.STATIC)
				object2d.setStatic();
			this.objects.push(object2d);
		}
	}

	/** 
	* Clone object and add it's copy to the map
	* @param {Object2D} obj 
	*/
	addObjectClone(obj) {
		this.objects.push( obj.clone(this.graphics, this.physics) );
	}

	addAsset(asset) {
		//console.log(asset);

		if(asset.shape === MapData.SHAPE_TYPE.CIRCLE) {
			var object2d = new Object2D(Type.CIRCLE, asset.radius||1, asset.radus||1, this.graphics, this.physics).set({'class': asset.theme});
		}
		else {
			var object2d = new Object2D(Type.RECT, asset.width||1, asset.height||1, this.graphics, this.physics).set({'class': asset.theme});
		}

		if(asset.dynamic === false)
			object2d.setStatic();

		//change initial position to somewhere outside camera view
		object2d.setPos(this.camera.x-this.camera.zoom-3, 0);

		this.objects.push(object2d);
		return object2d;
	}

	/** @param {Object2D} obj */
	removeObject(obj) {
		let i = this.objects.indexOf(obj);
		if(i === -1)
			return;
		this.objects.splice(i, 1);
		obj._destroy_(this.physics);
	}

	/** 
	* @param {{x: number, y: number}} coords 
	*/
	getObjectAt(coords) {
		for(let obj of this.objects) {
			switch(obj.type) {
				case Type.CIRCLE:
					if(Math.pow(coords.x-obj.transform.x, 2) + Math.pow(coords.y-obj.transform.y, 2) < 
						obj.transform.w*obj.transform.w) 
					{
						return obj;
					}
					break;
				case Type.RECT: {
					let x1 = coords.x - obj.transform.x;
					let y1 = coords.y - obj.transform.y;

					let s = Math.sin(-obj.transform.rot);
					let c = Math.cos(-obj.transform.rot);

					let x2 = x1 * c - y1 * s;
					let y2 = y1 * c + x1 * s;

					if(x2 < obj.transform.w && x2 > -obj.transform.w && y2 < obj.transform.h && y2 > -obj.transform.h)
					{
						return obj;
					}

				}	break;
			}
		}

		return null;
	}

	/**
	* @param {number} x
	* @param {number} y
	* @param {number} zoom
	*/
	updateCamera(x, y, zoom) {
		this.camera.x = x;
		this.camera.y = y;
		this.camera.zoom = zoom;

		this.graphics.updateView(this.camera);
		this.background.update(this.camera, this.graphics.background_layer);
	}

	update() {
		if(!this.paused)
			this.physics.update();
		this.graphics.update();
	}
}