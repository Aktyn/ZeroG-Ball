import MapData from './map_data';
import Config from './config';

export const THEMES = {
	'czerwony':	'red',
	'zielony': 	'green',
	'skrzynia': 'crate',
	'wyjscie':	'exit',
	'trawa': 	'grass',
	'lawa': 	'lava'
};

export const OBJECTS = {//some of those name must not be changed due to correlation with other code
	'exit': {
		name: 'Wyjście',
		theme: THEMES.wyjscie,
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.2
	},
	'domino_block': {
		name: 'Blok domina',
		theme: THEMES.czerwony,
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.05,
		height: 0.15
	},
	'red_ball': {
		name: 'Piłka',
		theme: THEMES.zielony,
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.1
	},
	'crate': {
		name: 'Skrzynia',
		theme: THEMES.skrzynia,
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.1,
		height: 0.1
	},
	'lava': {
		name: 'Lawa',
		theme: THEMES.lawa,
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.1,
		height: 0.1
	},
	'grass': {
		name: 'Trawa',
		theme: THEMES.trawa,
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.1,
		height: 0.1
	},
};

export const TEXTURES = {//names must much those in svg.scss
	'player_texture': {
		src: require('./../img/textures/player.png'),
		width: Config.VIRT_SCALE*0.1,
		height: Config.VIRT_SCALE*0.1
	},
	'exit_texture': {
		src: require('./../img/textures/exit.png'),
		width: Config.VIRT_SCALE*0.2,
		height: Config.VIRT_SCALE*0.2
	},
	'crate_texture': {
		src: require('./../img/textures/crate.jpg'),
		width: Config.VIRT_SCALE*0.1,
		height: Config.VIRT_SCALE*0.1
	},
	'lava_texture': {
		src: require('./../img/textures/lava.jpg'),
		width: Config.VIRT_SCALE*0.1,
		height: Config.VIRT_SCALE*0.1
	},
	'grass_texture': {
		src: require('./../img/textures/grass.png'),
		width: Config.VIRT_SCALE*0.1,
		height: Config.VIRT_SCALE*0.1
	}
}
