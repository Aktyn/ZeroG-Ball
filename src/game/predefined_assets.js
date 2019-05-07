import MapData from './map_data';
import Config from './config';

export const CATEGORIES = {
	all: 				'WSZYSTKIE',
	active: 			'INTERAKTYWNE',
	dynamic: 			'DYNAMICZNE',
	building_blocks: 	'BUDULCE',
};

export const OBJECTS = {//some of those name must not be changed due to correlation with other code
	'exit': {
		name: 'Wyjście',
		class_name: 'exit',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.2,
		categories: [CATEGORIES.all, CATEGORIES.active]
	},
	'sawblade': {
		name: 'Piła tarczowa',
		class_name: 'sawblade',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.15,
		categories: [CATEGORIES.all, CATEGORIES.active]
	},
	'forcefield': {
		name: 'Pole siłowe',
		class_name: 'forcefield',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.225,
		categories: [CATEGORIES.all, CATEGORIES.active]
	},
	'portal1': {
		name: 'Portal 1',
		class_name: 'portal1',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.15,
		categories: [CATEGORIES.all, CATEGORIES.active]
	},
	'portal2': {
		name: 'Portal 2',
		class_name: 'portal2',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.15,
		categories: [CATEGORIES.all, CATEGORIES.active]
	},
	'portal3': {
		name: 'Portal 3',
		class_name: 'portal3',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.15,
		categories: [CATEGORIES.all, CATEGORIES.active]
	},
	'spiky_crate': {
		name: 'Kolczasta skrzynia',
		class_name: 'spiky_crate',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.3,
		height: 0.3,
		categories: [CATEGORIES.all, CATEGORIES.active, CATEGORIES.building_blocks]
	},
	'cannon': {
		name: 'Armata',
		class_name: 'cannon',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.15,
		categories: [CATEGORIES.all, CATEGORIES.active]
	},
	'domino_block': {
		name: 'Blok domina',
		class_name: 'red',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.05,
		height: 0.15,
		categories: [CATEGORIES.all, CATEGORIES.building_blocks]
	},
	'green_ball': {
		name: 'Piłka',
		class_name: 'green',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.1,
		categories: [CATEGORIES.all, CATEGORIES.dynamic, CATEGORIES.building_blocks]
	},
	'crate': {
		name: 'Skrzynia',
		class_name: 'crate',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.1,
		height: 0.1,
		categories: [CATEGORIES.all, CATEGORIES.building_blocks]
	},
	'lava': {
		name: 'Lawa',
		class_name: 'lava',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.1,
		height: 0.1,
		categories: [CATEGORIES.all, CATEGORIES.building_blocks]
	},
	'grass': {
		name: 'Trawa',
		class_name: 'grass',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.1,
		height: 0.1,
		categories: [CATEGORIES.all, CATEGORIES.building_blocks]
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
		width: Config.VIRT_SCALE * OBJECTS.exit.radius,
		height: Config.VIRT_SCALE * OBJECTS.exit.radius
	},
	'sawblade_texture': {
		src: require('./../img/textures/sawblade.png'),
		width: Config.VIRT_SCALE * OBJECTS.sawblade.radius,
		height: Config.VIRT_SCALE * OBJECTS.sawblade.radius
	},
	'forcefield_texture': {
		src: require('./../img/textures/forcefield.png'),
		width: Config.VIRT_SCALE * OBJECTS.forcefield.radius,
		height: Config.VIRT_SCALE * OBJECTS.forcefield.radius
	},
	'portal1_texture': {
		src: require('./../img/textures/portal1.png'),
		width: Config.VIRT_SCALE * OBJECTS.portal1.radius,
		height: Config.VIRT_SCALE * OBJECTS.portal1.radius
	},
	'portal2_texture': {
		src: require('./../img/textures/portal2.png'),
		width: Config.VIRT_SCALE * OBJECTS.portal2.radius,
		height: Config.VIRT_SCALE * OBJECTS.portal2.radius
	},
	'portal3_texture': {
		src: require('./../img/textures/portal3.png'),
		width: Config.VIRT_SCALE * OBJECTS.portal3.radius,
		height: Config.VIRT_SCALE * OBJECTS.portal3.radius
	},
	'spiky_crate_texture': {
		src: require('./../img/textures/spiky_crate.png'),
		width: Config.VIRT_SCALE * OBJECTS.spiky_crate.width,
		height: Config.VIRT_SCALE * OBJECTS.spiky_crate.height
	},
	'cannon_texture': {
		src: require('./../img/textures/cannon.png'),
		width: Config.VIRT_SCALE * OBJECTS.cannon.radius,
		height: Config.VIRT_SCALE * OBJECTS.cannon.radius
	},
	'crate_texture': {
		src: require('./../img/textures/crate.jpg'),
		width: Config.VIRT_SCALE * OBJECTS.crate.width,
		height: Config.VIRT_SCALE * OBJECTS.crate.height
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