import $ from './../utils/html';
import Stage from './stage';
import './../styles/menu.css';

const _void_func = ()=>{};

export default class Menu extends Stage {
	constructor(target, listeners) {
		super(target, 'menu-container', listeners)
		

		this.start_btn = $.create('button').text('START').on('click', listeners.onStart);

		this.container.addChild(
			this.start_btn
		);
	}

	close() {
		if(this.start_btn)
			this.start_btn.off('click', this.listeners.onStart);

		super.close();
	}
}