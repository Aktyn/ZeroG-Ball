import $ from './../utils/html';
import Stage from './stage';
import SvgEngine from './svg_engine';
import GUI from './gui';

import Config from './config';

import './../styles/game.css';
import bg1 from './../img/backgrounds/bg1.png';

export default class Game extends Stage {
	constructor(target, listeners) {
		super(target, 'game-container', listeners);

		this.svg = new SvgEngine();
		this.gui = new GUI();

		this.container.addChild(
			this.svg.getNode(), this.gui.getNode()
		);

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

		if(res.width / res.height > Config.ASPECT)
			res.width = res.height*Config.ASPECT;
		else
			res.height = res.width/Config.ASPECT;

		Object.assign(this.container.style, {width: `${res.width}px`, height: `${res.height}px`});
		this.svg.onResize(res.width, res.height);
	}

	loadMap() {
		console.log(bg1);
		this.svg.addObjects(//.setSize(0.5, 0.5)
			SvgEngine.createObject('image').set({'href': bg1}).setPos(-1, 0),
			SvgEngine.createObject('image').set({'href': bg1}).setPos(1, 0),
			SvgEngine.createObject('rect').setRot(Math.PI*0.25).setSize(1, 0.02)
				.setPos(1, 1/Math.SQRT2+0.25).set({'fill': 'rgb(0, 128, 255)'}),
			SvgEngine.createObject('rect').setSize(1, 0.02)
				.setPos(-1/Math.SQRT2, 0.25).set({'fill': 'rgb(0, 128, 255)'}),
		
			SvgEngine.createObject('circle').setSize(0.1).setPos(0, -0.5)
				.set({'fill': 'rgb(255, 128, 128)'})
		);

		this.svg.update();

		/*let t = 0;
		setInterval(() => {//temp
			this.svg.updateCamera(Math.cos(t), Math.sin(t), 2);
			t += Math.PI/60 * 0.5;
		}, 1000/60);*/
	}
}