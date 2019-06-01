import MapData from './map_data';
import Config from './config';

export const CATEGORIES = {
	all: 				'WSZYSTKIE',
	active: 			'INTERAKTYWNE',
	dynamic: 			'DYNAMICZNE',
	building_blocks: 	'BUDULCE',
	logic: 				'LOGICZNE',
	powerups: 			'POWERUPY',
	tutorial: 			'WPROWADZENIE'
};

export const TUTORIAL_TEXTURES = {
	'tutorial_introduction': {
		src: require('./../img/textures/tutorial/introduction.png'),
		width: Config.VIRT_SCALE*1.000,
		height: Config.VIRT_SCALE*0.576
	},
	'tutorial_damage_info': {
		src: require('./../img/textures/tutorial/damage_info.png'),
		width: Config.VIRT_SCALE*0.794,
		height: Config.VIRT_SCALE*0.328
	},
	'tutorial_doors': {
		src: require('./../img/textures/tutorial/doors.png'),
		width: Config.VIRT_SCALE*0.754,
		height: Config.VIRT_SCALE*0.134
	},
	'tutorial_portals_info': {
		src: require('./../img/textures/tutorial/portals_info.png'),
		width: Config.VIRT_SCALE*0.754,
		height: Config.VIRT_SCALE*0.194
	}
};

export const OBJECTS = {//some of those name must not be changed due to correlation with other code
	'exit': {
		name: 'Wyjście',
		class_name: 'exit',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.2,
		categories: [CATEGORIES.all, CATEGORIES.active]
	},
	'enemy': {
		name: 'Przeciwnik',
		class_name: 'enemy',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.2,
		categories: [CATEGORIES.all, CATEGORIES.active]
	},
	'aid': {
		name: 'Apteczka',
		class_name: 'aid',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.1,
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
	'revolving_door': {
		name: 'Drzwi obrotowe',
		class_name: 'revolving_door',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.1,
		height: 0.1,
		categories: [CATEGORIES.all, CATEGORIES.dynamic]
	},
	'crate': {
		name: 'Skrzynia',
		class_name: 'crate',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.15,
		height: 0.15,
		categories: [CATEGORIES.all, CATEGORIES.building_blocks]
	},
	'lava': {
		name: 'Lawa',
		class_name: 'lava',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.15,
		height: 0.15,
		categories: [CATEGORIES.all, CATEGORIES.building_blocks]
	},
	'grass': {
		name: 'Trawa',
		class_name: 'grass',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.15,
		height: 0.15,
		categories: [CATEGORIES.all, CATEGORIES.building_blocks]
	},
	'bricks': {
		name: 'Cegły',
		class_name: 'bricks',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.15,
		height: 0.15,
		categories: [CATEGORIES.all, CATEGORIES.building_blocks]
	},

	//keys and doors
	'key1': {
		name: 'Klucz 1',
		class_name: 'key1',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.1,
		categories: [CATEGORIES.all, CATEGORIES.logic]
	},
	'door1': {
		name: 'Drzwi 1',
		class_name: 'door1',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.075,
		height: 0.4,
		categories: [CATEGORIES.all, CATEGORIES.logic]
	},
	'elevator': {
		name: 'Winda',
		class_name: 'elevator',
		shape: MapData.SHAPE_TYPE.RECT,
		width: 0.4,
		height: 0.4,
		categories: [CATEGORIES.all, CATEGORIES.logic]
	},
	//items
	'speedboost': {
		name: 'Przyspieszenie',
		class_name: 'speedboost',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.1,
		categories: [CATEGORIES.all, CATEGORIES.logic, CATEGORIES.powerups]
	},
	'shrinker': {
		name: 'Pomniejszenie',
		class_name: 'shrinker',
		shape: MapData.SHAPE_TYPE.CIRCLE,
		radius: 0.1,
		categories: [CATEGORIES.all, CATEGORIES.logic, CATEGORIES.powerups]
	},

	//(TEMP) make available objects from tutorial textures
	...(function() {
		let parts_objects = {};
		for(let texture_name in TUTORIAL_TEXTURES) {
			parts_objects[texture_name] = {
				name: texture_name.replace(/^tutorial_/, ''),
				class_name: texture_name,
				shape: MapData.SHAPE_TYPE.RECT,
				width: 1,
				height: 1,
				categories: [CATEGORIES.tutorial]
			}
		}
		return parts_objects;
	})()
};

export const TEXTURES = {//names must much those in svg.scss
	'player_texture': {
		src: require('./../img/textures/player.png'),
		width: Config.VIRT_SCALE*0.1,
		height: Config.VIRT_SCALE*0.1
	},
	'enemy_texture': {
		src: require('./../img/textures/enemy.png'),
		width: Config.VIRT_SCALE * OBJECTS['enemy'].radius,
		height: Config.VIRT_SCALE * OBJECTS['enemy'].radius
	},
	'exit_texture': {
		src: require('./../img/textures/exit.png'),
		width: Config.VIRT_SCALE * OBJECTS['exit'].radius,
		height: Config.VIRT_SCALE * OBJECTS['exit'].radius
	},
	'aid_texture': {
		src: require('./../img/textures/aid.png'),
		width: Config.VIRT_SCALE * OBJECTS['aid'].radius,
		height: Config.VIRT_SCALE * OBJECTS['aid'].radius
	},
	'sawblade_texture': {
		src: require('./../img/textures/sawblade.png'),
		width: Config.VIRT_SCALE * OBJECTS['sawblade'].radius,
		height: Config.VIRT_SCALE * OBJECTS['sawblade'].radius
	},
	'forcefield_texture': {
		src: require('./../img/textures/forcefield.png'),
		width: Config.VIRT_SCALE * OBJECTS['forcefield'].radius,
		height: Config.VIRT_SCALE * OBJECTS['forcefield'].radius
	},
	'portal1_texture': {
		src: require('./../img/textures/portal1.png'),
		width: Config.VIRT_SCALE * OBJECTS['portal1'].radius,
		height: Config.VIRT_SCALE * OBJECTS['portal1'].radius
	},
	'portal2_texture': {
		src: require('./../img/textures/portal2.png'),
		width: Config.VIRT_SCALE * OBJECTS['portal2'].radius,
		height: Config.VIRT_SCALE * OBJECTS['portal2'].radius
	},
	'portal3_texture': {
		src: require('./../img/textures/portal3.png'),
		width: Config.VIRT_SCALE * OBJECTS['portal3'].radius,
		height: Config.VIRT_SCALE * OBJECTS['portal3'].radius
	},
	'revolving_door_texture': {//only for in-gui preview
		src: require('./../img/textures/revolving_door.png'),
		width: 0,//Config.VIRT_SCALE * OBJECTS['revolving_door'].radius,
		height: 0,//Config.VIRT_SCALE * OBJECTS['revolving_door'].radius
	},
	'spiky_crate_texture': {
		src: require('./../img/textures/spiky_crate.png'),
		width: Config.VIRT_SCALE * OBJECTS['spiky_crate'].width,
		height: Config.VIRT_SCALE * OBJECTS['spiky_crate'].height
	},
	'cannon_texture': {
		src: require('./../img/textures/cannon.png'),
		width: Config.VIRT_SCALE * OBJECTS['cannon'].radius,
		height: Config.VIRT_SCALE * OBJECTS['cannon'].radius
	},
	'crate_texture': {
		src: require('./../img/textures/crate.jpg'),
		width: Config.VIRT_SCALE * OBJECTS['crate'].width,
		height: Config.VIRT_SCALE * OBJECTS['crate'].height
	},
	'lava_texture': {
		src: require('./../img/textures/lava.jpg'),
		width: Config.VIRT_SCALE * OBJECTS['lava'].width,
		height: Config.VIRT_SCALE * OBJECTS['lava'].height
	},
	'grass_texture': {
		src: require('./../img/textures/grass.jpg'),
		width: Config.VIRT_SCALE * OBJECTS['grass'].width,
		height: Config.VIRT_SCALE * OBJECTS['grass'].height
	},
	'bricks_texture': {
		src: require('./../img/textures/bricks.jpg'),
		width: Config.VIRT_SCALE * OBJECTS['bricks'].width,
		height: Config.VIRT_SCALE * OBJECTS['bricks'].height
	},
	'key1_texture': {
		src: require('./../img/textures/key1.png'),
		width: Config.VIRT_SCALE * OBJECTS['key1'].radius,
		height: Config.VIRT_SCALE * OBJECTS['key1'].radius
	},
	'elevator_texture': {
		src: require('./../img/textures/elevator.png'),
		width: Config.VIRT_SCALE * OBJECTS['elevator'].width,
		height: Config.VIRT_SCALE * OBJECTS['elevator'].height
	},
	'elevator_texture_up': {
		src: require('./../img/textures/elevatorUp.png'),
		width: Config.VIRT_SCALE * OBJECTS['elevator'].width,
		height: Config.VIRT_SCALE * OBJECTS['elevator'].height
	},
	'elevator_texture_down': {
		src: require('./../img/textures/elevatorDown.png'),
		width: Config.VIRT_SCALE * OBJECTS['elevator'].width,
		height: Config.VIRT_SCALE * OBJECTS['elevator'].height
	},
	'speedboost_texture': {
		src: require('./../img/textures/speed.png'),
		width: Config.VIRT_SCALE * OBJECTS['speedboost'].radius,
		height: Config.VIRT_SCALE * OBJECTS['speedboost'].radius
	},
	'shrinker_texture': {
		src: require('./../img/textures/shrink.png'),
		width: Config.VIRT_SCALE * OBJECTS['shrinker'].radius,
		height: Config.VIRT_SCALE * OBJECTS['shrinker'].radius
	},
	...TUTORIAL_TEXTURES
};

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
	{
		name: 'Mozaika',
		src: require('./../img/backgrounds/bg7.jpg'),
		color: '#ac7874',
	},
];
