import SvgEngine from './svg_engine';
import SvgObject from './svg';
import Config from './config';

import bg_texture from './../img/backgrounds/bg2.png';

const BG_SMOOTHING = 0.9;
const TILE_SCALE = 2;

export default class Background {
	/**
	* @param {number} tiles_x
	* @param {number} tiles_y
	*/
	constructor(tiles_x, tiles_y) {
		this.tiles_x = tiles_x;
		this.tiles_y = tiles_y;

		this.tiles = [];//2d array

		for(var y=0; y<tiles_y; y++) {
			for(var x=0; x<tiles_x; x++) {
				let xx = (-tiles_x + 1 + x*2)*TILE_SCALE;
				let yy = (-tiles_y + 1 + y*2)*TILE_SCALE
				let tile = SvgEngine.createObject('image')//.setClass('nearest')
					.set({'href': bg_texture}).setSize(TILE_SCALE, TILE_SCALE);
				tile.update();
				tile.set({
					'transform': `translate(${
						xx*Config.VIRT_SCALE/2-x} ${
						yy*Config.VIRT_SCALE/2-y}) scale(${x%2 ? 1 : -1}, ${y%2 ? 1 : -1})`
				});
				this.tiles.push(tile);
			}
		}
	}

	/**
	* @param {number} camera_x
	* @param {number} camera_y
	* @param {number} zoom
	* @param {SvgObject} bg_layer
	*/
	update(camera_x, camera_y, zoom, bg_layer) {
		bg_layer.setPos(camera_x/zoom*BG_SMOOTHING, camera_y/zoom*BG_SMOOTHING).update();
		/*for(var y=0; y<this.tiles_y; y++) {
			for(var x=0; x<this.tiles_x; x++) {
				var i = x + y*this.tiles_x;

				//bg.setPos(xx, yy); //static background
				this.tiles[i].setPos(
					(-this.tiles_x + 1 + x*2) + camera_x/zoom*BG_SMOOTHING, 
					(-this.tiles_y + 1 + y*2) + camera_y/zoom*BG_SMOOTHING
				);
			}
		}*/
	}
}