// @ts-check
<<<<<<< HEAD
import $ from './../utils/html';
import Map from './map';
import MapData from './map_data';
import Config from './config';
=======
// import $ from './../utils/html';
import Map, {STATE} from './map';
import MapData from './map_data';
import Config from './config';
//import Settings from './settings';
import Player from './objects/player';
import Object2D from './objects/object2d';
import {Body} from './simple_physics/body';
import handleCollision from './collision_handler';

/**
* 	@typedef {{
		x: number, y: number, 
		w: number, h: number, 
		rot: number,
	}} 
	Transform
*/
>>>>>>> stage3

/**
* Starts an update loop
* @param {GameCore} self
*/
function runLoop(self) {
<<<<<<< HEAD
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
=======
	let last = performance.now(), dt = 0;
>>>>>>> stage3

	var step = function(time) {
		dt = time - last;
		last = time;

		if(self._running) {
<<<<<<< HEAD
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

//let t = 0;//tmp
const ZOOM_STRENGTH = 0.1;

export default class GameCore extends Map {
	constructor() {
		super();//map

		this.map_data = new MapData();
		super.loadObjects(this.map_data);

		this._running = false;

		//this.mouse_pressed = false;
		this.last_mouse_coords = null;
		/** @type {DOMRect} */
		this.svg_rect = null;//{x: 0, y: 0, width: 100, height: 100};

		let node = super.getNode();

		node.addEventListener('wheel', this.onMouseWheel.bind(this), false);
		node.addEventListener('mousedown', this.onMouseDown.bind(this), false);
		window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
		//window.addEventListener('mouseleave', this.onMouseLeave.bind(this), false);
		window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
=======
			self.update(dt);
			window.requestAnimationFrame(step);
		}
	};
	step(last);
}

const CAMERA_SMOOTHNESS = 0.003;
const INITIAL_ZOOM = 2;
const ZOOM_SMOTHNESS = 0.006;
const ZOOM_STRENGTH = 0.2;

export default class GameCore extends Map {
	constructor(listeners = {}, map_data = undefined) {
		super();//map

		this.listeners = listeners;

		this.map_data = new MapData(map_data);
		super.load(this.map_data);

		this.steering = {
			left:	false,
			right:	false,
			up:		false,
			down:	false,
			slow: 	false
		};
		this.sticky_stamp = false;

		this._running = false;
		this.elapsed_time = 0;

		this.target_zoom = INITIAL_ZOOM;

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
>>>>>>> stage3
	}

	run() {
		this._running = true;
<<<<<<< HEAD
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
=======
		this.elapsed_time = 0;
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
		this.target_zoom = INITIAL_ZOOM;
		this.player = new Player(this.graphics, this.physics, this.onPlayerHpChange.bind(this));
		super.addObject( this.player );
	}

	/** @param {number} hp */
	onPlayerHpChange(hp) {
		if(typeof this.listeners.onPlayerHpChange === 'function')
			this.listeners.onPlayerHpChange(hp);

		if(this.player.health <= 0)
			this.reload();
	}

	/**
	*	@param {Body} A
	*	@param {Body} B
	*/
	onCollision(A, B) {
		handleCollision(this, A, B);
	}

	/**
	* @param {number} w
	* @param {number} h
	* @param {number} aspect
	*/
	onResize(w, h, aspect) {
		this.aspect = aspect;
		super.onResize(w, h, aspect);
		this.svg_rect = super.getNode().getBoundingClientRect();//must go after super.onResize
>>>>>>> stage3
	}

	convertCoords(e) {
		return {
			x: (e.clientX - this.svg_rect.x) / this.svg_rect.width, 
			y: (e.clientY - this.svg_rect.y) / this.svg_rect.height
		};
	}

	onMouseWheel(e) {
<<<<<<< HEAD
		let dt = e.wheelDelta/120;

		let new_zoom = this.camera.zoom*(1-ZOOM_STRENGTH*dt);
		new_zoom = Math.max(0.2, Math.min(new_zoom, this.background.getMaxZoom()));
		
		super.updateCamera(this.camera.x, this.camera.y, new_zoom);
=======
		let dt = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));

		let next_zoom = Math.min(6, this.camera.zoom*(1-ZOOM_STRENGTH*dt));
		this.target_zoom = Math.max(0.2, 
			Math.min(next_zoom, this.background.getMaxZoom(this.aspect)));
>>>>>>> stage3
	}

	onMouseDown(e) {
		if(e.button !== 0)
			return;
		//save position
		this.last_mouse_coords = this.convertCoords(e);
<<<<<<< HEAD
=======
		this.click_pos.x = this.last_mouse_coords.x;
		this.click_pos.y = this.last_mouse_coords.y;
>>>>>>> stage3
	}

	onMouseUp(e) {
		if(e.button !== 0)
			return;
<<<<<<< HEAD
		this.last_mouse_coords = null;
	}

	/*onMouseLeave() {
		console.log('x');
		this.mouse_pressed = false;
	}*/

	onMouseMove(e) {
		if(this.last_mouse_coords === null)
			return;
		//console.log(e.clientX, e.clientY);

		let coords = this.convertCoords(e);
		//console.log(coords);
		let dx = (this.last_mouse_coords.x - coords.x)*2*Config.ASPECT * this.camera.zoom;
=======

		let c = this.convertCoords(e);

		const tollerance = 0.005;
		let not_moved = Math.abs(c.x-this.click_pos.x) <= tollerance && 
			Math.abs(c.y-this.click_pos.y) <= tollerance;

		if(not_moved) {
			if(this.stamp !== null) {//place stamp
				this.map_data.addObject(this.stamp);
				super.addObjectClone(this.stamp);
			}
			else if(this.state === STATE.EDIT_MODE) {//no stamp and edit mode
				//selecting object under mouse cursor
				if(typeof this.listeners.onObjectSelect === 'function') {
					this.listeners.onObjectSelect(
						super.getObjectAt(super.castCoords(this.convertCoords(e)))
					);
				}
			}
		}

		this.last_mouse_coords = null;
	}

	onMouseMove(e) {
		if(this.stamp !== null) {
			let c = super.castCoords(this.convertCoords(e));
			if(this.sticky_stamp) {//round position to 0.1
				c.x = ((c.x*10)|0)/10;
				c.y = ((c.y*10)|0)/10;
			}
			this.stamp.setPos(c.x, c.y);
		}

		if(this.last_mouse_coords === null || this.state === STATE.RUNNING)
			return;

		let coords = this.convertCoords(e);
		let dx = (this.last_mouse_coords.x - coords.x)*2*this.aspect * this.camera.zoom;
>>>>>>> stage3
		let dy = (this.last_mouse_coords.y - coords.y)*2 * this.camera.zoom;
		super.updateCamera(this.camera.x+dx, this.camera.y+dy, this.camera.zoom);
		this.last_mouse_coords = coords;
	}

<<<<<<< HEAD
	update(dt) {
		/*let xx = Math.cos(t)*0.5;
		let yy = Math.sin(-t*0.6)*0.28;
		let zoom = 1.25;
		super.updateCamera(xx, yy, zoom);

		t += Math.PI * dt/1000 * 0.25;*/

		super.update();
	}
}
=======
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
			case 17://ctrl
				this.sticky_stamp = enable;
				return;
		}
	}

	/** @param {number} state */
	changeState(state) {
		if(this.state === STATE.FINISHED)
			return;
		if(state === STATE.RUNNING)
			this.state = STATE.RUNNING;//this.game.paused = false;
		else
			this.state = STATE.EDIT_MODE;
		this.stamp = null;
		this.reload();
	}

	reload() {
		/*if(this.state === STATE.EDIT_MODE) {
			this.player = null;
			return;
		}*/
		if(this.state === STATE.FINISHED)
			this.state = STATE.RUNNING;
		super.load(this.map_data);
		this.elapsed_time = 0;

		if(this.state === STATE.RUNNING) {
			this.spawnPlayer();
			this.graphics.getNode().focus();
		}
		else if(this.state === STATE.EDIT_MODE)
			this.player = null;

		if(typeof this.listeners.onMapLoaded === 'function')
			this.listeners.onMapLoaded();
	}

	/** @param {string} data */
	importMap(data) {
		this.map_data.import(data);
		this.reload();
	}

	clearMap() {
		this.map_data.removeAll();
		this.reload();
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
	* @param {{time: number, transform: Transform}[]} keyframes
	*/
	updateObjectKeyframes(obj, keyframes) {
		if(this.map_data.updateObjectKeyframes(obj, keyframes) === false) {
			console.warn('Cannot update object keyframes');
			return;
		}

		obj.setKeyframes(keyframes);
	}

	/**
	* @param {Object2D} obj
	*/
	deleteObject(obj) {
		if(this.map_data.deleteObject(obj) === false)
			return;

		super.removeObject(obj);
	}

	/** @param {number} id */
	selectBackground(id) {
		// console.log(id);
		//this.background.selectBackground(id);
		this.map_data.selectBackground(id);
		this.reload();
	}

	/** @param {number} dt */
	updateCameraSmoothly(dt) {
		let zx = this.target_zoom - this.camera.zoom;

		if(!this.player) {
			if(Math.abs(zx) < 0.0001)
				return;
			this.camera.zoom += zx * dt * ZOOM_SMOTHNESS;
			super.updateCamera(this.camera.x, this.camera.y, this.camera.zoom);
			return;
		}
		let dx = this.player.getTransform().x - this.camera.x;
		let dy = this.player.getTransform().y - this.camera.y;

		if(Math.abs(dx) < 1/Config.VIRT_SCALE && 
			Math.abs(dy) < 1/Config.VIRT_SCALE && 
			Math.abs(zx) < 0.0001)
		{
			return;
		}

		let factor = Math.min( 1, dt * CAMERA_SMOOTHNESS / this.camera.zoom );

		this.camera.x += dx * factor;
		this.camera.y += dy * factor;
		this.camera.zoom += zx * dt * ZOOM_SMOTHNESS;
		super.updateCamera(this.camera.x, this.camera.y, this.camera.zoom);
	}

	/** @param {number} dt */
	update(dt) {
		if(dt > 1000)
			dt = 1000;

		if(this.state === STATE.RUNNING) {
			this.elapsed_time += dt;
			this.listeners.onTimerUpdate(this.elapsed_time);

			if(this.player && !this.paused) {
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
			}
		}

		this.updateCameraSmoothly(dt);
		super.update(dt);
	}
}
>>>>>>> stage3
