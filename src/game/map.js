import MapData from './map_data';
import SvgEngine from './svg_engine';
//import Physics from './physics/physics_engine';
import Object2D, {Type} from './objects/object2d';
//import {Circle, PolygonShape} from './physics/shape';
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

		this.camera = {
			x: 0, y: 0, zoom: 1
		};

		this.loadFilters();
		this.loadTextures();

		this.background = new Background(MAP_SIZE_X, MAP_SIZE_Y, BG_SMOOTHING, BG_SCALE);
		
		this.graphics.addBackgroundObjects(//.setSize(0.5, 0.5)
			...this.background.tiles,
		);

		//this.physics = new Physics();
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
		let object2d = new Object2D(Type.CIRCLE, 0.1, 0.1, this.graphics, this.physics)
			.set({'fill': 'rgb(255, 128, 128)'}).setPos(x||0, y||0);
	}

	/** @param {MapData} data*/
	loadObjects(data) {
		console.log('Loading map data');
		this.updateCamera(0, 0, 1);//reset camera

		for(let obj of data.getObjects()) {
			let shape = (type => {
				switch(type) {
					case MapData.SHAPE_TYPE.CIRCLE:	return Type.CIRCLE;
					case MapData.SHAPE_TYPE.RECT:	return Type.RECT;
				}
			})(obj.shape_type);

			let object2d = new Object2D(shape, obj.w||1, obj.h||1, this.graphics, this.physics)
				.set({'fill': 'rgb(64, 192, 255)'}).setPos(obj.x||0, obj.y||0).setRot(obj.rot||0);

			if(obj.physic_type === undefined || obj.physic_type === MapData.PHYSIC_TYPE.STATIC)
				object2d.setStatic();
			this.objects.push(object2d);
		}
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
		this.physics.update();
		this.graphics.update();
	}
}