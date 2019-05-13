//@ts-check
import $ from './html';
import './../styles/widgets.scss';

export default class {
	constructor() {
		this.widget = $.create('div').setClass('widget');
	}

	getWidget() {
		return this.widget;
	}
}