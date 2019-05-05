//@ts-check
import MapData from './map_data';
import SvgEngine from './svg_engine';
import Object2D, {Type} from './objects/object2d';
import Player from './objects/player';
import Exit from './objects/exit';
import SawBlade from './objects/sawblade';
import Forcefield from './objects/forcefield';
import Portal from './objects/portal';

import Background from './background';
import Config from './config';
import Settings from './settings';

import SimplePhysics from './simple_physics/engine';
import {Body} from './simple_physics/body';
import CollisionListener from './simple_physics/collision_listener';

import {TEXTURES} from './predefined_assets';
// import ball_texture from './../img/ball_texture.png';

export const STATE = {
	RUNNING: 0,
	EDIT_MODE: 1,
	FINISHED: 2
};

const BG_SMOOTHING = 0.8;
const MAP_SIZE_X = 3;//3;
const MAP_SIZE_Y = 3;//3;
const BG_SCALE = 2;

export default class Map extends CollisionListener {
	constructor() {
		super();

		this.graphics = new SvgEngine();
		this.graphics.foreground_layer.addClass('cartoon-style');

		//this.paused = false;
		this.state = STATE.RUNNING;

		this.camera = {
			x: 0, y: 0, zoom: 1
		};

		this.aspect = Number( Settings.getValue('aspect_ratio') );

		/** @type {Player | null} */
		this.player = null;

		this.loadFilters();
		this.loadTextures();

		this.background = new Background(MAP_SIZE_X, MAP_SIZE_Y, BG_SMOOTHING, BG_SCALE, this.graphics);
		
		this.graphics.addBackgroundObjects(//.setSize(0.5, 0.5)
			...this.background.tiles,
		);

		this.physics = new SimplePhysics();
		this.physics.assignCollisionListener(this);

		/** @type {Object2D[] */
		this.objects = [];
		//this.loadObjects();
		
		if(Settings.getValue('shadows') === true)
			this.graphics.foreground_layer.addClass('flat-shadows');

		Settings.watch('shadows', value => {
			if(value && !this.graphics.foreground_layer.hasClass('flat-shadows'))
				this.graphics.foreground_layer.addClass('flat-shadows');
			if(!value && this.graphics.foreground_layer.hasClass('flat-shadows'))
				this.graphics.foreground_layer.removeClass('flat-shadows');
		});

		if(Settings.getValue('textures') === false) {
			this.background.enableTextures(false);
			this.graphics.enableTextures(false);
		}

		Settings.watch('textures', enabled => {
			this.background.enableTextures(!!enabled);
			this.graphics.enableTextures(!!enabled);
		});
	}

	getNode() {
		return this.graphics.getNode();
	}

	/**
	* @param {number} w
	* @param {number} h
	* @param {number} aspect
	*/
	onResize(w, h, aspect) {
		this.graphics.onResize(w, h, aspect);
		this.graphics.updateView(this.camera);
	}

	/** 
	* Casts coordinates according to current camera zoom and position
	* @param {{x: number, y: number}} coords 
	*/
	castCoords({x, y}) {
		return {
			x: (x - 0.5) * this.aspect * 2 * this.camera.zoom + this.camera.x,
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

	loadTextures() {
		for(let [texture_name, texture] of Object.entries(TEXTURES)) {
			//console.log(texture_name, texture);
			this.graphics.createTexture(texture_name, texture.src, texture.width, texture.height);
		}
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
		object2d.body.velocity.y = 0.3;
	}

	createObject(class_name, shape, w, h, x = 0, y = 0, rot = 0) {
		/** @type {Object2D} */
		let obj;
		switch(class_name) {
			case 'exit':
				obj = new Exit(w||1, h||1, this.graphics, this.physics);
				break;
			case 'sawblade':
				obj = new SawBlade(w||1, h||1, this.graphics, this.physics);
				break;
			case 'forcefield':
				obj = new Forcefield(w||1, h||1, this.graphics, this.physics);
				break;
			case 'portal1':
			case 'portal2':
			case 'portal3': {
				let type = ['portal1', 'portal2', 'portal3'].indexOf(class_name);
				obj = new Portal(w||1, h||1, this.graphics, this.physics, type);
			}	break;
			default:
				obj = new Object2D(shape, w||1, h||1, this.graphics, this.physics);
				break;
		}
		obj.setPos(x||0, y||0).setRot(rot||0);
		return obj;
	}

	/** @param {MapData} data*/
	load(data) {
		console.log('Loading map data');

		this.graphics.clearForeground();
		this.physics.removeObjects();
		this.objects = [];

		for(let obj of data.getObjects()) {
			let shape = (type => {
				switch(type) {
					case MapData.SHAPE_TYPE.CIRCLE:	return Type.CIRCLE;
					case MapData.SHAPE_TYPE.RECT:	return Type.RECT;
				}
			})(obj.shape_type);

			/*.set({'fill': 'rgb(64, 192, 255)'})*/
			var object2d = this.createObject(obj.class_name, shape, obj.w, obj.h, obj.x, obj.y, obj.rot);

			if(obj.class_name)
				object2d.setClass(obj.class_name);

			if(obj.physic_type === undefined || obj.physic_type === MapData.PHYSIC_TYPE.STATIC)
				object2d.setStatic();
			this.objects.push(object2d);
		}

		this.background.selectBackground( data.getBackgroundID() );
	}

	addAsset(asset) {
		//console.log(asset);
		//let w, h, type;

		if(asset.shape === MapData.SHAPE_TYPE.CIRCLE) {
			//var object2d = new Object2D(Type.CIRCLE, asset.radius||1, asset.radius||1, this.graphics, this.physics).set({'class': asset.theme});
			var object2d = this.createObject(asset.class_name, Type.CIRCLE, asset.radius||1, asset.radius||1)
				.setClass(asset.class_name);
		}
		else {
			//var object2d = new Object2D(Type.RECT, asset.width||1, asset.height||1, this.graphics, this.physics).set({'class': asset.theme});
			var object2d = this.createObject(asset.class_name, Type.RECT, asset.width||1, asset.height||1)
				.setClass(asset.class_name);
		}

		//console.log( asset.class_name );

		if(asset.dynamic === false)
			object2d.setStatic();

		//change initial position to somewhere outside camera view
		object2d.setPos(this.camera.x-this.camera.zoom-3, 0);

		this.objects.push(object2d);
		return object2d;
	}

	/** 
	* Clone object and add it's copy to the map
	* @param {Object2D} obj 
	*/
	addObjectClone(obj) {
		let t = obj.getTransform();
		let clone = this.createObject(obj.getClassName(), obj.type, t.w, t.h, t.x, t.y, t.rot);
		clone.setClass(obj.getClassName());
		this.objects.push( clone );
		//this.objects.push( obj.clone(this.graphics, this.physics) );
	}

	/** @param {Object2D} obj */
	addObject(obj) {
		this.objects.push(obj);
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

	/** @param {number} dt */
	update(dt) {
		if(this.state === STATE.RUNNING)//if(!this.paused)
			this.physics.update();
		// this.graphics.update(dt);
		//this loop was moved from SvgEngine.update method
		let to_remove;
		for(let obj of this.objects) {
			obj.update(dt);
			if(obj.isOutOfRange() || obj.to_destroy) {
				if(obj === this.player) {
					this.player.kill();
					continue;
				}
				to_remove = to_remove || [];
				to_remove.push(obj);
			}
		}

		if(to_remove) {
			console.log('removing objects:', to_remove);
			to_remove.forEach(this.removeObject.bind(this));
		}
	}
}