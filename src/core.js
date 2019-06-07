<<<<<<< HEAD
<<<<<<< HEAD
import $ from './utils/html';
import MenuStage from './stages/menu';
import GameStage from './stages/game';
=======
=======
>>>>>>> origin/stage3
//@ts-check
import $ from './utils/html';
import MenuStage from './stages/menu';
import GameStage from './stages/game';
import SPEECH_COMMANDS from "./game/speech_recognition";
<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3

let initialized = false;

let current_stage = null;

/**
 * Initializes the menu
 * @param {Node} main_div
 */
function initMenu(main_div) {
	current_stage = new MenuStage(main_div, {
<<<<<<< HEAD
<<<<<<< HEAD
		onStart: function() {
			current_stage.close();
			initGame(main_div);
		}
	});

	current_stage.listeners.onStart();//temp test
=======
=======
>>>>>>> origin/stage3
		onStart: function(map_data) {
			current_stage.close();
			initGame(main_div, map_data);
		}
	});

	//current_stage.listeners.onStart();//temp test
<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3
}

/**
 * Initializes the game
 * @param {Node} main_div
<<<<<<< HEAD
<<<<<<< HEAD
 */
function initGame(main_div) {
	current_stage = new GameStage(main_div, {
		onExit() {//TODO - invoke from game class
			current_stage.close();
			initMenu(main_div);
		}
	});
=======
=======
>>>>>>> origin/stage3
 * @param {{name: string, json: any}} map_data
 */
function initGame(main_div, map_data) {
	current_stage = new GameStage(main_div, {
		onExit: function() {
			current_stage.close();
			initMenu(main_div);
		},
		/** @param {{name: string, json: any}} map */
		onMapStart: function(map) {
			current_stage.close();
			initGame(main_div, map);
		}
	}, map_data);
<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3

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

<<<<<<< HEAD
<<<<<<< HEAD
		initialized = true;
	}
}
=======
=======
>>>>>>> origin/stage3
		SPEECH_COMMANDS.start();//init speech recognition

		initialized = true;
	}
}
<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3
