import SvgEngine from './svg_engine';
import SvgObject from './svg';
import Config from './config';

import bg_texture from './../img/backgrounds/bg4.png';
// import bg_texture from './../img/backgrounds/blured.png';

// @ts-check
export default class Background {
	/**
	* @param {number} tiles_x
	* @param {number} tiles_y
	* @param {number} _smoothing
	*/
	constructor(tiles_x, tiles_y, _smoothing, _scale) {
		this.tiles_x = tiles_x;
		this.tiles_y = tiles_y;
		this.smoothing = _smoothing;
		this.scale = _scale;

		this.tiles = [];//2d array

		for(var y=0; y<tiles_y; y++) {
			for(var x=0; x<tiles_x; x++) {
				let xx = (-tiles_x + 1 + x*2)*this.scale;
				let yy = (-tiles_y + 1 + y*2)*this.scale
				let tile = SvgEngine.createObject('image').setClass('nearest')
					.set({'href': bg_texture}).setSize(this.scale, this.scale);
				tile.update();
				tile.set({
					'transform': `translate(${
						xx*Config.VIRT_SCALE/2-x} ${
						yy*Config.VIRT_SCALE/2-y}) scale(${x%2 ? 1 : -1}, ${y%2 ? 1 : -1})`
				});
				this.tiles.push(tile);
			}
		}

		this._maxZoom = this.calculateMaxZoom();
	}

	calculateMaxZoom() {
		const max_zoom_x = Math.pow(this.tiles_x*this.scale / Config.ASPECT, 
			1/(1-this.smoothing));
		const max_zoom_y = Math.pow(this.tiles_y*this.scale, 
			1/(1-this.smoothing));
		return Math.min(max_zoom_x, max_zoom_y);
	}

	getMaxZoom() {
		return this._maxZoom;
	}

	/**
	* @param {{x: number, y: number, zoom: number}} camera
	* @param {SvgObject} bg_layer
	*/
	update(camera, bg_layer) {
		let scale = Math.pow(camera.zoom, this.smoothing);
		bg_layer.setPos(camera.x*this.smoothing, camera.y*this.smoothing)
			.setSize(scale).update(true);
	}
}