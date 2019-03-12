import $ from './../utils/html';
import Stage from './stage';

import GameCore from './../game/game_core';
import GameGUI from './../game/game_gui';

import Config from './../game/config';

import './../styles/game.scss';
import './../styles/gui.scss';

export default class GameStage extends Stage {
	constructor(target, listeners) {
		super(target, 'game-container', listeners);

		this.gui = new GameGUI({
			onReturnToMenu: () => {
				if(this.game)
					this.game.end();
				this.listeners.onExit();
			}
		});
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
}