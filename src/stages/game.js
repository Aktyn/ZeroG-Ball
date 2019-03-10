import $ from './../utils/html';
import Stage from './stage';

import GameCore from './../game/game_core';
import GUI from './../game/gui';

import Config from './../game/config';

import './../styles/game.css';

export default class GameStage extends Stage {
	constructor(target, listeners) {
		super(target, 'game-container', listeners);

		this.gui = new GUI();
		this.game = new GameCore();

		this.container.addChild(
			this.game.getNode(), this.gui.getNode()
		);

		window.addEventListener('resize', this.onResize.bind(this), false);
		this.onResize();

		//this.running = false;
		//this.run();

		this.game.run();
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
		this.game.onResize(res.width, res.height);
	}

	

	loadMap() {
		/*let t = 0;
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
		}, 1000/60);*/
	}
}