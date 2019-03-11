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
		
		this.graphics.addObjects(//.setSize(0.5, 0.5)
			...this.background.tiles,

			/*SvgEngine.createObject('rect').setRot(Math.PI*0.25).setSize(1, 0.02)
				.setPos(1, 1/Math.SQRT2+0.25).set({'fill': 'rgb(0, 128, 255)'}),
			SvgEngine.createObject('rect').setSize(1, 0.02)
				.setPos(-1/Math.SQRT2, 0.25).set({'fill': 'rgb(0, 128, 255)'}),
		
			SvgEngine.createObject('circle').setSize(0.1).setPos(0, -0.5)
				.set({'fill': 'rgb(255, 128, 128)'})*/
		);

		this.physics = new Physics();

		/** @type {Object2D[] */
		this.objects = [];
		this.loadObjects();

		/*let c = new Circle(0.1);
		let body = this.physics.add(c, 0.01, 0.01);

		// let c2 = new Circle(0.5);
		// let body2 = this.physics.add(c2, 0.1001, 35);
		// body2.setStatic();

		// let body3 = this.physics.add(c2, -0.6001, 35);
		// body3.setStatic();

		// let body4 = this.physics.add(c2, 0.6001, 35);
		// body4.setStatic();
		//body.setPos(0, 20);
		
		let floor = new PolygonShape();
		floor.setBox(0.5, 0.1);
		let body5 = this.physics.add(floor, 0, 0.9);
		body5.setStatic();
		body5.setOrient(Math.PI*0.001);*/
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
			new Object2D(Type.CIRCLE, 0.1, 0.1, this.graphics, this.physics)
				.set({'fill': 'rgb(255, 128, 128)'}).setPos(0, -0.5),

			new Object2D(Type.RECT, 0.8, 0.3, this.graphics, this.physics)
				.set({'fill': 'rgb(64, 192, 255)'}).setPos(0, 0.3).setRot(-Math.PI*0.01).setStatic(),
		);
	}

	onResize(w, h) {
		this.graphics.onResize(w, h);
	}

	getNode() {
		return this.graphics.getNode();
	}

	updateCamera(x, y, zoom) {
		this.graphics.updateCamera(x, y, zoom);
		this.background.update(x, y, zoom);
	}

	update() {
		this.graphics.update();
		this.physics.step();
		//console.log(this.physics.bodies[0].position, this.physics.bodies[1].position);
	}
}