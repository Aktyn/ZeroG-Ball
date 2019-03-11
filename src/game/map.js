import SvgEngine from './svg_engine';
import Physics from './physics/physics_engine';
import Object2D, {Type} from './objects/object2d';
import {Circle, PolygonShape} from './physics/shape';
import Background from './background';
import Config from './config';

const BG_SMOOTHING = 0.7;
//TODO - BACKGROUND_TILE_SCALE
const MAP_SIZE_X = 4;
const MAP_SIZE_Y = 2;

export default class Map {
	constructor() {
		this.graphics = new SvgEngine().addClass('cartoon-style').addClass('flat-shadows');

		this.loadFilters();

		this.background = new Background(MAP_SIZE_X, MAP_SIZE_Y);
		
		this.graphics.addBackgroundObjects(//.setSize(0.5, 0.5)
			...this.background.tiles,
		);

		this.physics = new Physics();

		/** @type {Object2D[] */
		this.objects = [];
		this.loadObjects();
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

	loadObjects() {
		this.objects.push( 
			new Object2D(Type.RECT, 0.8, 0.3, this.graphics, this.physics)
				.set({'fill': 'rgb(64, 192, 255)'}).setPos(0, 0.3).setRot(Math.PI*0.).setStatic(),

			new Object2D(Type.RECT, 0.8, 0.1, this.graphics, this.physics)
				.set({'fill': 'rgb(64, 192, 255)'}).setPos(-0.95, 0.).setRot(Math.PI/2).setStatic(),

			new Object2D(Type.RECT, 0.8, 0.1, this.graphics, this.physics)
				.set({'fill': 'rgb(64, 192, 255)'}).setPos(1.1, 0.1).setRot(-Math.PI*0.4).setStatic(),

			new Object2D(Type.RECT, 0.1, 0.2, this.graphics, this.physics)
				.set({'fill': 'rgb(128, 255, 128)'}).setPos(0.1, -0.8).setRot(Math.PI*0.1),
		);

		for(let i=0; i<3; i++) {
			for(let j=0; j<3; j++) {
				this.objects.push(
					new Object2D(Type.CIRCLE, 0.1, 0.1, this.graphics, this.physics)
						.set({'fill': 'rgb(255, 128, 128)'}).setPos(-0.1 + i*0.25-j*0.05, -0.4 - 0.9*j),
				);
			}
		}
	}

	onResize(w, h) {
		this.graphics.onResize(w, h);
	}

	getNode() {
		return this.graphics.getNode();
	}

	updateCamera(x, y, zoom) {
		this.graphics.updateCamera(x, y, zoom);
		this.background.update(x, y, zoom, this.graphics.background_layer);
	}

	update() {
		this.graphics.update();
		this.physics.step();
		//console.log(this.physics.bodies[0].position, this.physics.bodies[1].position);
	}
}