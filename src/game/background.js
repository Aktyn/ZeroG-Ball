<<<<<<< HEAD
<<<<<<< HEAD
import SvgEngine from './svg_engine';
import SvgObject from './svg';
import Config from './config';

import bg_texture from './../img/backgrounds/bg2.png';

// @ts-check
=======
=======
>>>>>>> origin/stage3
//@ts-check
import SvgEngine from './svg_engine';
import SvgObject from './svg';
import Config from './config';
import Settings from './settings';

// import bg_texture from './../img/backgrounds/bg1.png';
import {BACKGROUNDS} from './predefined_assets';

<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3
export default class Background {
	/**
	* @param {number} tiles_x
	* @param {number} tiles_y
	* @param {number} _smoothing
<<<<<<< HEAD
<<<<<<< HEAD
	*/
	constructor(tiles_x, tiles_y, _smoothing, _scale) {
=======
	* @param {SvgEngine} graphics
	*/
	constructor(tiles_x, tiles_y, _smoothing, _scale, graphics) {
>>>>>>> stage3
=======
	* @param {SvgEngine} graphics
	*/
	constructor(tiles_x, tiles_y, _smoothing, _scale, graphics) {
>>>>>>> origin/stage3
		this.tiles_x = tiles_x;
		this.tiles_y = tiles_y;
		this.smoothing = _smoothing;
		this.scale = _scale;
<<<<<<< HEAD
<<<<<<< HEAD

=======
		this.graphics = graphics;

		/** @type {SvgObject[]} */
>>>>>>> stage3
=======
		this.graphics = graphics;

		/** @type {SvgObject[]} */
>>>>>>> origin/stage3
		this.tiles = [];//2d array

		for(var y=0; y<tiles_y; y++) {
			for(var x=0; x<tiles_x; x++) {
				let xx = (-tiles_x + 1 + x*2)*this.scale;
				let yy = (-tiles_y + 1 + y*2)*this.scale
<<<<<<< HEAD
<<<<<<< HEAD
				let tile = SvgEngine.createObject('image')//.setClass('nearest')
					.set({'href': bg_texture}).setSize(this.scale, this.scale);
				tile.update();
=======
				let tile = SvgEngine.createObject('image').setClass('nearest')
					.set({'href': BACKGROUNDS[0].src}).setSize(this.scale, this.scale);
				tile.update(0);
>>>>>>> stage3
=======
				let tile = SvgEngine.createObject('image').setClass('nearest')
					.set({'href': BACKGROUNDS[0].src}).setSize(this.scale, this.scale);
				tile.update(0);
>>>>>>> origin/stage3
				tile.set({
					'transform': `translate(${
						xx*Config.VIRT_SCALE/2-x} ${
						yy*Config.VIRT_SCALE/2-y}) scale(${x%2 ? 1 : -1}, ${y%2 ? 1 : -1})`
				});
				this.tiles.push(tile);
			}
		}

<<<<<<< HEAD
<<<<<<< HEAD
		this._maxZoom = this.calculateMaxZoom();
	}

	calculateMaxZoom() {
		const max_zoom_x = Math.pow(this.tiles_x*this.scale / Config.ASPECT, 
=======
=======
>>>>>>> origin/stage3
		this.aspect = Number(Settings.getValue('aspect_ratio'));
		this.background = 0;
		this._maxZoom = this.calculateMaxZoom();

		if(Settings.getValue('textures') === false)
			this.selectBackground(this.background, false);

		Settings.watch('textures', enabled => this.selectBackground(this.background, !!enabled));
	}

	calculateMaxZoom() {
		const max_zoom_x = Math.pow(this.tiles_x*this.scale / this.aspect,
<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3
			1/(1-this.smoothing));
		const max_zoom_y = Math.pow(this.tiles_y*this.scale, 
			1/(1-this.smoothing));
		return Math.min(max_zoom_x, max_zoom_y);
	}

<<<<<<< HEAD
<<<<<<< HEAD
	getMaxZoom() {
		return this._maxZoom;
	}

=======
=======
>>>>>>> origin/stage3
	/** @param {number} aspect */
	getMaxZoom(aspect) {
		if(this.aspect !== aspect) {
			this.aspect = aspect;
			this._maxZoom = this.calculateMaxZoom();
		}
		return this._maxZoom;
	}

	/** 
	 * @param {number} id
	 * @param {boolean?} texture_enabled
	 */
	selectBackground(id, texture_enabled = undefined) {
		if(texture_enabled === undefined)
			texture_enabled = !!Settings.getValue('textures');
		this.background = id;
		for(let tile of this.tiles) {
			if(texture_enabled) {
				tile.set({'href': BACKGROUNDS[id].src});
				tile.setClass(BACKGROUNDS[id].linear ? '' : 'nearest');
			}
			else {
				tile.node.removeAttributeNS(null, 'href');
				this.graphics.getNode().style.background = BACKGROUNDS[id].color;
			}
		}
	}

	/**
	 * @param {boolean} enabled
	 */
	enableTextures(enabled) {
		this.selectBackground(this.background, enabled);
	}

<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3
	/**
	* @param {{x: number, y: number, zoom: number}} camera
	* @param {SvgObject} bg_layer
	*/
	update(camera, bg_layer) {
		let scale = Math.pow(camera.zoom, this.smoothing);
<<<<<<< HEAD
		bg_layer.setPos(camera.x*this.smoothing, camera.y*this.smoothing)
<<<<<<< HEAD
			.setSize(scale).update(true);
=======
			.setSize(scale, scale).update(0, true);
>>>>>>> stage3
=======
		let dx = camera.x*this.smoothing;
		let dy = camera.y*this.smoothing;

		let pos_x = dx + (1-scale)*(camera.x-dx);
		let pos_y = dy + (1-scale)*(camera.y-dy);

		//if((camera.x+camera.zoom) / (pos_x + (this.tiles_x*this.scale)*scale) > 1)

		bg_layer.setPos(pos_x, pos_y)
			.setSize(scale, scale).update(0, true);
>>>>>>> origin/stage3
	}
}