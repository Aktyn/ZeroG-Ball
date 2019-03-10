import SvgEngine from './svg_engine';

import bg_texture from './../img/backgrounds/bg3.png';

const BG_SMOOTHING = 0.9;

export default class Background {
	constructor(tiles_x, tiles_y) {
		this.tiles_x = tiles_x;
		this.tiles_y = tiles_y;

		this.tiles = [];//2d array

		for(var y=0; y<tiles_y; y++) {
			for(var x=0; x<tiles_x; x++) {
				this.tiles.push(
					SvgEngine.createObject('image').setClass('nearest').set({'href': bg_texture})
						.setPos(-tiles_x + 1 + x*2, -tiles_y + 1 + y*2),
				);
			}
		}
	}

	update(camera_x, camera_y, zoom) {
		for(var y=0; y<this.tiles_y; y++) {
			for(var x=0; x<this.tiles_x; x++) {
				var i = x + y*this.tiles_x;

				//bg.setPos(xx, yy); //static background
				this.tiles[i].setPos(
					(-this.tiles_x + 1 + x*2) + camera_x/zoom*BG_SMOOTHING, 
					(-this.tiles_y + 1 + y*2) + camera_y/zoom*BG_SMOOTHING
				);
			}
		}
	}
}