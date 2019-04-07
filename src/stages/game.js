// @ts-check
import $ from './../utils/html';
import Stage from './stage';

import GameCore from './../game/game_core';
import GameGUI from './../game/game_gui';

// import Config from './../game/config';
import Settings from './../game/settings';

import './../styles/game.scss';
import './../styles/gui.scss';

export default class GameStage extends Stage {
	constructor(target, listeners) {
		super(target, 'game-container', listeners);

		this.game = new GameCore({
			onObjectSelect: (obj) => {
				if(this.gui)
					this.gui.selectObject(obj);
			},
			onMapLoaded: () => {
				if(this.gui)
					this.gui.reloadMapData(this.game.map_data);
			}
		});
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
				this.game.stamp = null;
				this.game.reload(mode === 0);
			},

			onAssetSelected: this.game.onAssetSelected.bind(this.game),
			onRestart: () => this.game.reload(true),
			onClearMap: () => this.game.clearMap(),
			undo: () => this.game.undoLastChange(),

			exportMapData: () => this.game.map_data.export(),
			onImport: this.game.importMap.bind(this.game),

			//object edit listeners
			updateObjectTransform: this.game.updateObjectTransform.bind(this.game),
			deleteObject: this.game.deleteObject.bind(this.game),

			//other edit listeners
			selectBackground: this.game.selectBackground.bind(this.game)
		});

		this.gui.reloadMapData(this.game.map_data);

		this.container.addChild(
			this.game.getNode(), this.gui.getNode()
		);

		window.addEventListener('resize', () => {
			this.onResize( Number(Settings.getValue('aspect_ratio')) );
		}, false);

		Settings.watch( 'aspect_ratio', val => this.onResize(Number(val)) );
		
		setTimeout(() => this.onResize( Number(Settings.getValue('aspect_ratio')) ), 1);

		//this.running = false;
		//this.run();

		this.game.run();
		console.log('game started');
	}

	close() {
		window.removeEventListener('resize', this.onResize.bind(this), false);
		super.close();
	}

	/**
	 * @param  {number} aspect
	 */
	onResize(aspect) {//window resize event
		let res = $.getScreenSize();

		if(res.width / res.height > aspect)
			res.width = res.height*aspect;
		else
			res.height = res.width/aspect;

		Object.assign(this.container.style, {width: `${res.width}px`, height: `${res.height}px`});
		if(this.game)
			this.game.onResize(res.width, res.height, aspect);
	}
}