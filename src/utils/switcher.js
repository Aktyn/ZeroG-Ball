//@ts-check
import $ from './html';
import Widget from './widget';

export default class Switcher extends Widget {
	/**
	 * @param  {(enabled: boolean) => void} onChange
	 */
	constructor(onChange) {
		super();
		this.onChange = onChange;
		this.state = 0;//0 - off, 1 - on
		this.widget.addClass('switcher').on('click', () => {
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