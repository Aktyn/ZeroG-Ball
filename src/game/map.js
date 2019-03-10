import SvgEngine from './svg_engine';
import Background from './background';
import Config from './config';

const BG_SMOOTHING = 0.7;
//TODO - BACKGROUND_TILE_SCALE
const MAP_SIZE_X = 4;
const MAP_SIZE_Y = 2;

export default class Map {
	constructor() {
		this.graphics = new SvgEngine().addClass('cartoon-style');

		this.loadFilters();

		this.background = new Background(MAP_SIZE_X, MAP_SIZE_Y);
		
		this.graphics.addObjects(//.setSize(0.5, 0.5)
			...this.background.tiles,

			SvgEngine.createObject('rect').setRot(Math.PI*0.25).setSize(1, 0.02)
				.setPos(1, 1/Math.SQRT2+0.25).set({'fill': 'rgb(0, 128, 255)', 'filter': 'url(#long-shadow)'}),
			SvgEngine.createObject('rect').setSize(1, 0.02)
				.setPos(-1/Math.SQRT2, 0.25).set({'fill': 'rgb(0, 128, 255)', 'filter': 'url(#long-shadow)'}),
		
			SvgEngine.createObject('circle').setSize(0.1).setPos(0, -0.5)
				.set({'fill': 'rgb(255, 128, 128)', 'filter': 'url(#long-shadow)'})
		);

		this.graphics.update();//temporary here
	}

	loadFilters() {
		this.graphics.createFilter('long-shadow',
			{
				name: 'feOffset',
				attribs: {'result': 'offOut1', 'in': 'SourceGraphic', 'dx': Config.VIRT_SCALE*0.01, 'dy': Config.VIRT_SCALE*0.01}
			},
			{
				name: 'feColorMatrix',
				attribs: {'result': "matrixOut", 'in': "offOut", 'type': "matrix", 'values': "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"}
				//0.6 0 0 0 0 0 0.6 0 0 0 0 0 0.6 0 0 0 0 0 1 0
			},
			{
				name: 'feBlend',
				attribs: {'result': 'out1', 'in': "SourceGraphic", 'in2': "matrixOut", 'mode': "normal"}
			},
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
	}
}