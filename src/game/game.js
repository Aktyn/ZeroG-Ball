import $ from './../utils/html';
import Stage from './stage';
import SvgEngine from './svg_engine';
import GUI from './gui';

import './../styles/game.css';

const ASPECT = 1280/720;//width / height

export default class Game extends Stage {
	constructor(target, listeners) {
		super(target, 'game-container', listeners);

		this.svg = new SvgEngine(ASPECT);
		this.gui = new GUI();

		this.container.addChild(
			this.svg.getNode(), this.gui.getNode()
		);

		window.addEventListener('resize', this.onResize.bind(this), false);
		this.onResize();

		console.log('game started');
	}

	onResize() {//window resize event
		let res = $.getScreenSize();
		//console.log(res);

		if(res.width / res.height > ASPECT) {
			Object.assign(this.container.style, 
				{width: `${res.height*ASPECT}px`, height: `${res.height}px`});
		}
		else {
			Object.assign(this.container.style, 
				{width: `${res.width}px`, height: `${res.width/ASPECT}px`});
		}
	}

	close() {
		window.removeEventListener('resize', this.onResize.bind(this), false);
		super.close();
	}
}