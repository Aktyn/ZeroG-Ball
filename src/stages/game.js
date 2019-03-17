// @ts-check
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

		this.game = new GameCore();
		this.gui = new GameGUI({
			onReturnToMenu: () => {
				if(this.game) {
					this.game.destroy();
					this.game = null;
				}
				this.listeners.onExit();
			},
			onModeChange: (mode) => {
				if(mode === 0)
					this.game.paused = false;
				else
					this.game.paused = true;
				this.game.reload(mode === 0);
			},
			onRestart: () => {
				this.game.reload(true);
			},
			onClearMap: () => {
				console.log('clear map');
				this.game.clearMap();
			},
			undo: () => {
				this.game.undoLastChange();
			},
			/*redo: () => {
				
			}*/

			exportMapData: () => {
				return this.game.map_data.export();
			},
			onImport: (json_data) => {
				this.game.importMap(json_data);
			}
		});

		this.container.addChild(
			this.game.getNode(), this.gui.getNode()
		);

		window.addEventListener('resize', this.onResize.bind(this), false);
		
		setTimeout(() => this.onResize(), 1);

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