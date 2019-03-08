import $ from './../utils/html';
import Menu from './menu';

let initialized = false;

export default {
	init: () => {
		if(initialized)
			throw new Error('game core is already initialized');

		let main_div = $(document.getElementById('main'));
		if(!main_div)
			throw new Error('there must be an element with id = "main" in the page');

		main_div.text('');//clear any previous content

		let menu = new Menu(main_div, {
			onStart: function() {
				menu.close();
				
			}
		});

		initialized = true;
	}
}