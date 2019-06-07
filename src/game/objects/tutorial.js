//@ts-check
import Object2D, {Type} from './object2d';
import CollisionCategories from './collision_categories';
import SvgEngine from '../svg_engine';
import SimplePhysics from '../simple_physics/engine';
import {TUTORIAL_TEXTURES} from '../predefined_assets';
import Config from '../config';

export default class tutorial extends Object2D {
	/**
	* @param {string} class_name
	* @param {number} w
	* @param {number} h
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	*/
	constructor(class_name, w, h, graphics_engine, physics_engine) {
		let texture = TUTORIAL_TEXTURES[class_name];
		if(!texture)
			throw new Error('Tutorial texture not recognized');
		super(Type.RECT, texture.width/Config.VIRT_SCALE, texture.height/Config.VIRT_SCALE, 
			graphics_engine, physics_engine, 2);

		this.body.setMask( 0 );
		//fill attribute cannot be set directly since css rules have higher priority
		super.set({'style': `fill: url(#${class_name});`});//note - class_name and texture name must match
	}
}