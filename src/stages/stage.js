import $ from './../utils/html';

export default class Stage {
	constructor(target, container_class, listeners) {
		this.listeners = listeners;

		this.container = $.create('div').addClass(container_class);
		target.addChild(this.container);
	}

	close() {
		//removing stage html from page
		this.container.remove();
	}
}