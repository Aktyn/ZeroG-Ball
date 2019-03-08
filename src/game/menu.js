import $ from './../utils/html';
import './../styles/menu.css';

const _void_func = ()=>{};

export default class Menu {
	constructor(target, listeners) {
		this.listeners = listeners;

		this.start_btn = $.create('button').text('START').on('click', listeners.onStart);

		this.container = $.create('div').addClass('menu-container').addChild(
			this.start_btn
		);

		target.addChild(this.container);
	}

	close() {
		if(this.start_btn)
			this.start_btn.off('click', this.listeners.onStart);
		
		//removing menu html from page
		this.container.remove();
	}
}