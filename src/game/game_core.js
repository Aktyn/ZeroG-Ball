// @ts-check
import $ from './../utils/html';
import Map from './map';
import MapData from './map_data';
import Config from './config';
import Player from './objects/player';
import Object2D from './objects/object2d';

/**
* Starts an update loop
* @param {GameCore} self
*/
function runLoop(self) {
	let last = 0, dt;

	var step = function(time) {
		dt = time - last;
		last = time;

		if(self._running) {
			self.update(dt);
			window.requestAnimationFrame(step);
		}
	};
	step(0);
}

//let t = 0;//tmp
const ZOOM_STRENGTH = 0.1;
const CAMERA_SMOOTHNESS = 0.003;

export default class GameCore extends Map {
	constructor(listeners = {}) {
		super();//map

		this.listeners = listeners;

		this.map_data = new MapData();
		super.load(this.map_data);

		this.steering = {
			left:	false,
			right:	false,
			up:		false,
			down:	false,
			slow: 	false
		};

		this._running = false;

		//this.mouse_pressed = false;
		this.last_mouse_coords = null;
		this.click_pos = {x: 0, y: 0};
		/** @type {DOMRect} */
		this.svg_rect = null;//{x: 0, y: 0, width: 100, height: 100};
		let node = super.getNode();

		/** @type {Object2D | null} */
		this.stamp = null;

		node.addEventListener('mousewheel', this.onMouseWheel.bind(this), true);
		node.addEventListener('DOMMouseScroll', this.onMouseWheel.bind(this), true);
		node.addEventListener('mousedown', this.onMouseDown.bind(this), true);
		window.addEventListener('mouseup', this.onMouseUp.bind(this), true);
		window.addEventListener('mousemove', this.onMouseMove.bind(this), true);

		//steering
		window.addEventListener('keydown', this.onKeyDown.bind(this), true);
		window.addEventListener('keyup', this.onKeyUp.bind(this), true);
	}

	run() {
		this._running = true;
		runLoop(this);

		this.spawnPlayer();
	}

	destroy() {
		//removing listeners
		let node = super.getNode();
		node.removeEventListener('mousewheel', this.onMouseWheel.bind(this), true);
		node.removeEventListener('DOMMouseScroll', this.onMouseWheel.bind(this), true);
		node.removeEventListener('mousedown', this.onMouseDown.bind(this), true);
		window.removeEventListener('mouseup', this.onMouseUp.bind(this), true);
		window.removeEventListener('mousemove', this.onMouseMove.bind(this), true);

		window.removeEventListener('keydown', this.onKeyDown.bind(this), true);
		window.removeEventListener('keyup', this.onKeyUp.bind(this), true);

		this._running = false;
	}

	spawnPlayer() {
		this.player = new Player(this.graphics, this.physics);
		super.addObject( this.player );
	}

	/**
	* @param {number} w
	* @param {number} h
	*/
	onResize(w, h) {
		super.onResize(w, h);

		//@ts-ignore
		this.svg_rect = super.getNode().getBoundingClientRect();//must go after super.onResize
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
	}

	onMouseUp(e) {
		if(e.button !== 0)
			return;

		let c = this.convertCoords(e);

		const tollerance = 0.005;
		let not_moved = Math.abs(c.x-this.click_pos.x) <= tollerance && 
			Math.abs(c.y-this.click_pos.y) <= tollerance;

		if(not_moved) {
			if(this.stamp !== null) {//place stamp
				this.map_data.addObject(this.stamp);
				super.addObjectClone(this.stamp);
			}
			else if(this.paused) {//no stamp and edit mode
				//selecting object under mouse cursor
				if(typeof this.listeners.onObjectSelect === 'function') {
					this.listeners.onObjectSelect(
						super.getObjectAt(super.castCoords(this.convertCoords(e)))
					);
				}
			}

			if(!this.paused) {
				super.addTestCircle(super.castCoords(this.convertCoords(e)));
			}
		}

		this.last_mouse_coords = null;
	}

	onMouseMove(e) {
		if(this.stamp !== null) {
			let c = super.castCoords(this.convertCoords(e));
			this.stamp.setPos(c.x, c.y);
		}

		if(this.last_mouse_coords === null || !this.paused)
			return;

		let coords = this.convertCoords(e);
		let dx = (this.last_mouse_coords.x - coords.x)*2*Config.ASPECT * this.camera.zoom;
		let dy = (this.last_mouse_coords.y - coords.y)*2 * this.camera.zoom;
		super.updateCamera(this.camera.x+dx, this.camera.y+dy, this.camera.zoom);
		this.last_mouse_coords = coords;
	}

	/** @param {KeyboardEvent} e */
	onKeyDown(e) {
		this.updateSteering(e.keyCode, true);
	}

	/** @param {KeyboardEvent} e */
	onKeyUp(e) {
		this.updateSteering(e.keyCode, false);
	}

	/**
	* @param {number} code
	* @param {boolean} enable
	*/
	updateSteering(code, enable) {
		//console.log(code);
		switch(code) {
			case 37:
			case 65:
				this.steering.left = enable;
				return;
			case 39:
			case 68:
				this.steering.right = enable;
				return;
			case 38:
			case 87:
				this.steering.up = enable;
				return;
			case 40:
			case 83:
				this.steering.down = enable;
				return;
			case 32:
				this.steering.slow = enable;
				return;
		}
	}

	reload(reset_camera = false) {
		super.load(this.map_data, reset_camera);

		if(!this.paused) {
			this.spawnPlayer();
			this.graphics.getNode().focus();
		}
		else
			this.player = null;
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

	/**
	* @param {Object2D} obj
	* @param {{x: number, y: number, w: number, h: number, rot: number}} transform
	*/
	updateObjectTransform(obj, transform) {
		if(this.map_data.updateObjectTransform(obj, transform) === false) {
			console.warn('Cannot update object transform');
			return;
		}

		obj.setPos(transform.x, transform.y);
		obj.setSize(transform.w, transform.h);
		obj.setRot(transform.rot);
	}

	/**
	* @param {Object2D} obj
	*/
	deleteObject(obj) {
		if(this.map_data.deleteObject(obj) === false)
			return;

		super.removeObject(obj);
	}

	/** @param {number} dt */
	updateCameraSmoothly(dt) {
		let dx = this.player.getTransform().x - this.camera.x;
		let dy = this.player.getTransform().y - this.camera.y;

		if(Math.abs(dx) < 1/Config.VIRT_SCALE && Math.abs(dy) < 1/Config.VIRT_SCALE)
			return;

		let factor = dt * CAMERA_SMOOTHNESS / this.camera.zoom;

		this.camera.x += dx * Math.min(1, factor);
		this.camera.y += dy * Math.min(1, factor);
		super.updateCamera(this.camera.x, this.camera.y, this.camera.zoom);
	}

	/** @param {number} dt */
	update(dt) {
		if(dt > 1000)
			dt = 1000;

		if(this.player) {
			if(this.steering.left)
				this.player.move({x: -1, y: 0}, dt);
			if(this.steering.right)
				this.player.move({x: 1, y: 0}, dt);
			if(this.steering.up)
				this.player.move({x: 0, y: -1}, dt);
			if(this.steering.down)
				this.player.move({x: 0, y: 1}, dt);
			if(this.steering.slow)
				this.player.slowDown(dt);

			if(!this.paused)
				this.updateCameraSmoothly(dt);
		}

		super.update(dt);
	}
}