import $ from './../utils/html';

export default class SvgEngine {
	constructor(aspect) {
		this.width = aspect;//1024;
		this.height = 1;//Math.round(1024/aspect);

		this.container = $.create('svg').addClass('game-svg');
		this.container.setAttribute('width', this.width);
		this.container.setAttribute('height', this.height);
	}

	getNode() {
		return this.container;
	}
}