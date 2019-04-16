import MapData from './map_data';
import Config from './config';

/*export const THEMES = {//deprecated
	'czerwony':	'red',
	'zielony': 	'green',
	'skrzynia': 'crate',
	'wyjście':	'exit',
	'piła':		'sawblade',
	'trawa': 	'grass',
	'lawa': 	'lava'
};*/

export const OBJECTS = {//some of those name must not be changed due to correlation with other code
	'exit': {
		name: 'Wyjście',
		class_name: 'exit',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.2
	},
	'sawblade': {
		name: 'Piła tarczowa',
		class_name: 'sawblade',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.15
	},
	'domino_block': {
		name: 'Blok domina',
		class_name: 'red',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.05,
		height: 0.15
	},
	'red_ball': {
		name: 'Piłka',
		class_name: 'green',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.1
	},
	'crate': {
		name: 'Skrzynia',
		class_name: 'crate',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.1,
		height: 0.1
	},
	'lava': {
		name: 'Lawa',
		class_name: 'lava',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.1,
		height: 0.1
	},
	'grass': {
		name: 'Trawa',
		class_name: 'grass',
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
	'sawblade_texture': {
		src: require('./../img/textures/sawblade.png'),
		width: Config.VIRT_SCALE*0.15,
		height: Config.VIRT_SCALE*0.15
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
		src: require('./../img/textures/grass.jpg'),
		width: Config.VIRT_SCALE*0.1,
		height: Config.VIRT_SCALE*0.1
	}
}

/** @type {{name: string, src: string, color: string, linear?: boolean}[]} */
export const BACKGROUNDS = [//default value for linear attribute is: true
	{//first one is default for empty map
		name: 'Labirynt',
		src: require('./../img/backgrounds/bg1.png'),
		color: '#2b8177',
		linear: false
	},
	{
		name: 'Chmury',
		src: require('./../img/backgrounds/bg2.jpg'),
		color: '#8ab0c4',
	},
	{
		name: 'Lato',
		src: require('./../img/backgrounds/bg3.jpg'),
		color: '#dbb78b',
	},
	{
		name: 'Zima',
		src: require('./../img/backgrounds/bg4.jpg'),
		color: '#1a619f',
	},
	{
		name: 'Gradient',
		src: require('./../img/backgrounds/bg6.jpg'),
		color: '#a7a1be',
	},
];