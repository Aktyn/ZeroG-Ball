//@ts-check
import $ from './html';
import Widget from './widget';

export default class Slider extends Widget {
	/**
	 * @param {number} min
	 * @param {number} max
	 * @param  {(value: number) => void} onChange
	 */
	constructor(min, max, onChange) {
		super();
		this.onChange = onChange;

		this.min = min;
		this.max = max;
		this.length = max - min;

		this.value = 0;//0 - off, 1 - on

		this.width = 150;
		this.btn_width = 50;

		this.hold = false;

		let _updateSlider = e => {
			if(!this.hold)
				return;
			let rect = this.widget.getBoundingClientRect();
			let percent = (e.clientX - rect.left)/rect.width;
			this.setValue( this.min + percent*this.length );
		};

		this.value_btn = $.create('button').text('0').setStyle({
			'width': `${this.btn_width}px`
		});

		this.widget.addClass('slider').addChild( this.value_btn ).setStyle({
			'width': `${this.width}px`
		}).on('mousedown', e => {
			this.hold = true;
			this.value_btn.addClass('hold');
			_updateSlider(e);
		});

		window.addEventListener('mousemove', _updateSlider);
		window.addEventListener('mouseup', e => {
			this.hold = false;
			this.value_btn.removeClass('hold');
		});
	}

	/**
	 * @param {number} value
	 * @returns {Slider}
	 */
	setValue(value) {
		value = Math.max(this.min, Math.min(this.max, value));
		this.value = value;
		this.value_btn.text( ((this.value*100)|0)/100 ).setStyle({
			'transform': `translateX(${(this.width-this.btn_width) * (value-this.min)/this.length}px)`
		});

		if(typeof this.onChange === 'function')
			this.onChange(value);

		return this;
	}
}