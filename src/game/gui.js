import $ from './../utils/html';

export default class GUI {
	constructor() {
		this.container = $.create('div').addClass('game-gui-container').text('gui');
	}

	getNode() {
		return this.container;
	}
}