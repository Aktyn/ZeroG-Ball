//@ts-check
import $ from './html';
import './../styles/widgets.scss';

export default class Switcher {
	/**
	 * @param  {(enabled: boolean) => void} onChange
	 */
	constructor(onChange) {
		this.onChange = onChange;
		this.state = 0;//0 - off, 1 - on
		this.widget = $.create('div').setClass('switcher').on('click', () => {
			this.switch();
			if(typeof this.onChange === 'function')
				this.onChange(!!this.state);
		});
	}

	switch() {
		if( (this.state = 1 - this.state) )
			this.widget.addClass('on');
		else
			this.widget.removeClass('on');
	}

	getWidget() {
		return this.widget;
	}

	/**
	 * @param {Boolean} enabled
	 * @returns {Switcher}
	 */
	setEnabled(enabled = true) {
		if( this.state !== (enabled ? 1 : 0) )
			this.switch();
		return this;
	}
}