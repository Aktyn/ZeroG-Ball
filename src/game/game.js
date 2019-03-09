import $ from './../utils/html';
import Stage from './stage';
import SvgEngine from './svg_engine';
import GUI from './gui';

import Config from './config';

import './../styles/game.css';
import bg from './../img/backgrounds/bg3.png';

const BG_SMOOTHING = 0.7;
//TODO - BACKGROUND_TILE_SCALE
const MAP_SIZE_X = 4;
const MAP_SIZE_Y = 2;

export default class Game extends Stage {
	constructor(target, listeners) {
		super(target, 'game-container', listeners);

		this.svg = new SvgEngine();
		this.gui = new GUI();

		this.bg_tiles = [];//2d array

		this.container.addChild(
			this.svg.getNode(), this.gui.getNode()
		);

		window.addEventListener('resize', this.onResize.bind(this), false);
		this.onResize();

		this.loadFilters();
		this.loadMap();

		console.log('game started');
	}

	close() {
		window.removeEventListener('resize', this.onResize.bind(this), false);
		super.close();
	}

	onResize() {//window resize event
		let res = $.getScreenSize();

		if(res.width / res.height > Config.ASPECT)
			res.width = res.height*Config.ASPECT;
		else
			res.height = res.width/Config.ASPECT;

		Object.assign(this.container.style, {width: `${res.width}px`, height: `${res.height}px`});
		this.svg.onResize(res.width, res.height);
	}

	loadFilters() {
		this.svg.createFilter('long-shadow',
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

	loadMap() {
		for(var y=0; y<MAP_SIZE_Y; y++) {
			for(var x=0; x<MAP_SIZE_X; x++) {
				this.bg_tiles.push(
					SvgEngine.createObject('image').setClass('nearest').set({'href': bg})
						.setPos(-MAP_SIZE_X + 1 + x*2, -MAP_SIZE_Y + 1 + y*2),
				);
			}
		}
		
		this.svg.addObjects(//.setSize(0.5, 0.5)
			...this.bg_tiles,

			SvgEngine.createObject('rect').setRot(Math.PI*0.25).setSize(1, 0.02)
				.setPos(1, 1/Math.SQRT2+0.25).set({'fill': 'rgb(0, 128, 255)', 'filter': 'url(#long-shadow)'}),
			SvgEngine.createObject('rect').setSize(1, 0.02)
				.setPos(-1/Math.SQRT2, 0.25).set({'fill': 'rgb(0, 128, 255)', 'filter': 'url(#long-shadow)'}),
		
			SvgEngine.createObject('circle').setSize(0.1).setPos(0, -0.5)
				.set({'fill': 'rgb(255, 128, 128)', 'filter': 'url(#long-shadow)'})
		);

		this.svg.update();

		let t = 0;
		setInterval(() => {//temporary update-loop
			let xx = Math.cos(t)*0.5;
			let yy = Math.sin(t*0.5)*0.28;
			let zoom = 1.5;
			this.svg.updateCamera(xx, yy, zoom);

			for(var y=0; y<MAP_SIZE_Y; y++) {
				for(var x=0; x<MAP_SIZE_X; x++) {
					var i = x + y*MAP_SIZE_X;
					//bg.setPos(xx, yy); //static background
					this.bg_tiles[i].setPos(
						(-MAP_SIZE_X + 1 + x*2) + xx/zoom*BG_SMOOTHING, 
						(-MAP_SIZE_Y + 1 + y*2) + yy/zoom*BG_SMOOTHING
					);
				}
			}
			
			this.svg.update();

			t += Math.PI/60 * 0.3;
		}, 1000/60);
	}
}