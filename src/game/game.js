import $ from './../utils/html';
import Stage from './stage';
import SvgEngine from './svg_engine';
import GUI from './gui';

import Config from './config';

import './../styles/game.css';

export default class Game extends Stage {
	constructor(target, listeners) {
		super(target, 'game-container', listeners);

		this.svg = new SvgEngine();
		this.gui = new GUI();

		this.container.addChild(
			this.svg.getNode(), this.gui.getNode()
		);
		//this.container.innerHTML = `<svg class='game-svg' width="400" height="110"><rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" /></svg>`;

		window.addEventListener('resize', this.onResize.bind(this), false);
		this.onResize();

		this.loadMap();

		console.log('game started');
	}

	close() {
		window.removeEventListener('resize', this.onResize.bind(this), false);
		super.close();
	}

	onResize() {//window resize event
		let res = $.getScreenSize();

		var w, h;
		if(res.width / res.height > Config.ASPECT) {
			w = res.height*Config.ASPECT;
			h = res.height;
		}
		else {
			w = res.width;
			h = res.width/Config.ASPECT;
		}

		Object.assign(this.container.style, 
			{width: `${w}px`, height: `${h}px`});
		this.svg.onResize(w, h);
	}

	loadMap() {
		this.svg.addObject(//.setSize(0.5, 0.5)
			SvgEngine.createObject('rect').set({'fill': 'rgb(0, 0, 255)'})
		);

		/*this.svg.addObject(//.setSize(0.5, 0.5)
			SvgEngine.createObject('circle').set({'fill': 'rgb(0, 255, 255)'})
		);*/
	}
}