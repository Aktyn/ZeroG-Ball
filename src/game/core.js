import $ from './../utils/html';
import Menu from './menu';
import Game from './game';

let initialized = false;

let current_stage = null;

function initMenu(main_div) {
	current_stage = new Menu(main_div, {
		onStart: function() {
			current_stage.close();
			initGame(main_div);
		}
	});

	current_stage.listeners.onStart();//temp test
}

function initGame(main_div) {
	current_stage = new Game(main_div, {
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