import $ from './utils/html';
import MenuStage from './stages/menu';
import GameStage from './stages/game';

let initialized = false;

let current_stage = null;

/**
 * Initializes the menu
 * @param {Node} main_div
 */
function initMenu(main_div) {
	current_stage = new MenuStage(main_div, {
		onStart: function() {
			current_stage.close();
			initGame(main_div);
		}
	});

	current_stage.listeners.onStart();//temp test
}

/**
 * Initializes the game
 * @param {Node} main_div
 */
function initGame(main_div) {
	current_stage = new GameStage(main_div, {
		onEnd() {//TODO - invoke from game class
			current_stage.close();
		}
	});

	//current_stage.listeners.onEnd();//temp test
}

export default {
	init: () => {
		if(initialized)
			throw new Error('game core is already initialized');

		let main_div = $(document.getElementById('main'));
		if(!main_div)
			throw new Error('there must be an element with id = "main" in the page');
		main_div.text('');//clear any previous content

		initMenu(main_div);

		initialized = true;
	}
}