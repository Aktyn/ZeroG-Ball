import $ from './../utils/html';
import Map from './map';

/**
* Starts an update loop
* @param {GameCore} self
*/
function runLoop(self) {
	let last = 0, dt;

	//time measurments
	let timer, time_samples = [];
	let timer_log = $.create('SPAN').text('0ms')
		.setStyle({fontSize: '13px', fontFamily: 'Arial'});
	
	$(document.body).addChild($.create('DIV').setStyle({
		'position': 'fixed',
		'left': '0px',
		'bottom': '0px',
		'zIndex': '99',
		'background': '#0008',
		'color': '#fff',
		'fontSize': '13px',
		'fontFamily': 'Arial'
	}).text('updating + rendering: ').addChild(timer_log));

	var step = function(time) {
		dt = time - last;
		last = time;

		if(self._running) {
			timer = performance.now();
			self.update(dt);
			
			time_samples.push(performance.now() - timer);
			if(time_samples.length >= 120) {
				timer_log.text((time_samples.reduce( (a, b) => a+b ) / time_samples.length)
					.toFixed(2) + 'ms');
				time_samples = [];
			}

			window.requestAnimationFrame(step);
		}
	};
	step(0);
}

let t = 0;//tmp

export default class GameCore extends Map {
	constructor() {
		super();//load map

		this._running = false;
	}

	run() {
		this._running = true;
		runLoop(this);
	}

	update(dt) {
		let xx = Math.cos(t)*0.5;
		let yy = Math.sin(t*0.6)*0.28;
		let zoom = 1.5;
		super.updateCamera(xx, yy, zoom);
		
		super.update();

		t += Math.PI * dt/1000 * 0.5;
	}
}