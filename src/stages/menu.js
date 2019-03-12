import $ from './../utils/html';
import Stage from './stage';
import './../styles/menu.scss';

const _void_func = ()=>{};

export default class MenuStage extends Stage {
	constructor(target, listeners) {
		super(target, 'menu-container', listeners)
		

		this.start_btn = $.create('button').text('START').on('click', listeners.onStart);

		this.avaible_levels = $.create('p').text('TODO - lista dostępnych map');

		this.container.addChild(
			this.start_btn, this.avaible_levels
		);
	}

	close() {
		if(this.start_btn)
			this.start_btn.off('click', this.listeners.onStart);

		super.close();
	}
}