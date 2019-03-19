// @ts-check
import $ from './../utils/html';
import Map from './map';
import MapData from './map_data';
import Config from './config';
import Object2D from './objects/object2d';

/**
* Starts an update loop
* @param {GameCore} self
*/
function runLoop(self) {
	let last = 0, dt;

	//time measurments
	//let timer, time_samples = [];
	//let timer_log = $.create('SPAN').text('0ms').setStyle({fontSize: '13px', fontFamily: 'Arial'});
	
	/*$(document.body).addChild($.create('DIV').setStyle({
		'position': 'fixed',
		'left': '0px',
		'bottom': '0px',
		'zIndex': '99',
		'background': '#0008',
		'color': '#fff',
		'fontSize': '13px',
		'fontFamily': 'Arial'
	}).text('updating + rendering: ').addChild(timer_log));*/

	var step = function(time) {
		dt = time - last;
		last = time;

		if(self._running) {
			//timer = performance.now();
			self.update(dt);
			
			/*time_samples.push(performance.now() - timer);
			if(time_samples.length >= 120) {
				timer_log.text((time_samples.reduce( (a, b) => a+b ) / time_samples.length)
					.toFixed(2) + 'ms');
				time_samples = [];
			}*/

			window.requestAnimationFrame(step);
		}
	};
	step(0);
}

//let t = 0;//tmp
const ZOOM_STRENGTH = 0.1;

export default class GameCore extends Map {
	constructor() {
		super();//map

		this.map_data = new MapData();
		super.load(this.map_data);

		this._running = false;

		//this.mouse_pressed = false;
		this.last_mouse_coords = null;
		this.click_pos = {x: 0, y: 0};
		/** @type {DOMRect} */
		this.svg_rect = null;//{x: 0, y: 0, width: 100, height: 100};
		let node = super.getNode();

		/** @type {Object2D | null} */
		this.stamp = null;

		node.addEventListener('mousewheel', this.onMouseWheel.bind(this), false);
		node.addEventListener('DOMMouseScroll', this.onMouseWheel.bind(this), false);
		node.addEventListener('mousedown', this.onMouseDown.bind(this), false);
		window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
		//window.addEventListener('mouseleave', this.onMouseLeave.bind(this), false);
		window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
	}

	run() {
		this._running = true;
		runLoop(this);
	}

	destroy() {
		this._running = false;
	}

	/**
	* @param {number} w
	* @param {number} h
	*/
	onResize(w, h) {
		super.onResize(w, h);

		//@ts-ignore
		this.svg_rect = super.getNode().getBoundingClientRect();//must goes after super.onResize
	}

	convertCoords(e) {
		return {
			x: (e.clientX - this.svg_rect.x) / this.svg_rect.width, 
			y: (e.clientY - this.svg_rect.y) / this.svg_rect.height
		};
	}

	onMouseWheel(e) {
		let dt = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));

		let new_zoom = this.camera.zoom*(1-ZOOM_STRENGTH*dt);
		new_zoom = Math.max(0.2, Math.min(new_zoom, this.background.getMaxZoom()));
		
		super.updateCamera(this.camera.x, this.camera.y, new_zoom);
	}

	onMouseDown(e) {
		if(e.button !== 0)
			return;
		//save position
		this.last_mouse_coords = this.convertCoords(e);
		this.click_pos.x = this.last_mouse_coords.x;
		this.click_pos.y = this.last_mouse_coords.y;

		//var click_pos = super.castCoords(this.last_mouse_coords);
		//super.addTestCircle(click_pos);//tmp

		if(this.stamp) {//place stamp
			this.map_data.addObject(this.stamp);
			super.addObjectClone(this.stamp);
		}
	}

	onMouseUp(e) {
		if(e.button !== 0)
			return;

		let c = this.convertCoords(e);
		let not_moved = c.x === this.click_pos.x && c.y === this.click_pos.y;

		if(this.stamp === null && this.paused && not_moved) {//no stamp and edit mode
			//selecting object
			console.log( super.getObjectAt(super.castCoords(this.convertCoords(e))) );
			//TODO
		}

		this.last_mouse_coords = null;
	}

	/*onMouseLeave() {
		console.log('x');
		this.mouse_pressed = false;
	}*/

	onMouseMove(e) {
		if(this.stamp !== null) {
			let c = super.castCoords(this.convertCoords(e));
			this.stamp.setPos(c.x, c.y);
		}

		if(this.last_mouse_coords === null)
			return;
		//console.log(e.clientX, e.clientY);

		let coords = this.convertCoords(e);
		//console.log(coords);
		let dx = (this.last_mouse_coords.x - coords.x)*2*Config.ASPECT * this.camera.zoom;
		let dy = (this.last_mouse_coords.y - coords.y)*2 * this.camera.zoom;
		super.updateCamera(this.camera.x+dx, this.camera.y+dy, this.camera.zoom);
		this.last_mouse_coords = coords;

		
	}

	reload(reset_camera = false) {
		super.load(this.map_data, reset_camera);
	}

	/** @param {string} data */
	importMap(data) {
		this.map_data.import(data);
		this.reload(true);
	}

	clearMap() {
		this.map_data.removeAll();
		this.reload(true);
	}

	undoLastChange() {
		if(this.map_data.undo())
			this.reload();
	}

	onAssetSelected(asset) {
		if(this.stamp !== null) {
			super.removeObject(this.stamp);
			this.stamp = null;
		}
		//else
		if(asset !== null)
			this.stamp = super.addAsset(asset);
	}

	update(dt) {
		super.update();
	}
}