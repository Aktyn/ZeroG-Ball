//@ts-check
import Object2D, {Type} from './object2d';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';
import Player from './player';
import Config from '../config';

export default class RevolvingDoor extends Object2D {
	/**
	 * @param {number} w
	 * @param {number} h
	 * @param {SvgEngine} graphics_engine
	 * @param {SimplePhysics} physics_engine
	 * @param {Object2D[]} objects handle for objects array that are part of map
	 */
	constructor(w, h, graphics_engine, physics_engine, objects) {
		super(Type.CIRCLE, w, h, graphics_engine, physics_engine);
		this.objects = objects;
		this.body.setMask(0);
		
		//this.block_h = w/2.0;
		this.graphics = graphics_engine;
		this.physics = physics_engine;

		this.block_h = Config.player_size*4;
		this.block_gap = Config.player_size*1.5;

		this.center = new Object2D(Type.CIRCLE, w, h, graphics_engine, physics_engine, 2)
			.setClass('green').setStatic();
		this.center.editable = false;
		objects.push(this.center);

		/** @type {Object2D[]} */
		this.blocks = [];
		this.initBlocks(w, h);
	}

	/** @param {SimplePhysics} physics_engine */
	_destroy_(physics_engine) {
		this.blocks.forEach(b => b.to_destroy = true);
		this.center.to_destroy = true;
		super.destroy();
	}

	/**
	* @param {number} w
	* @param {number} h
	*/
	initBlocks(w, h) {
		this.blocks.forEach(b => b.to_destroy = true);
		this.blocks = [];

		let count = (w / Config.player_size) | 0;
		let ww = Math.min(0.1, w/2);
		let hh = this.block_h;
		for(let i=0; i<count*4; i++) {
			let block = new Object2D(Type.RECT, ww, hh, this.graphics, this.physics)
				.setClass('green').setStatic();
			block.editable = false;
			this.blocks.push( block );
		}
		this.objects.push(...this.blocks);

		this.center.setSize(w, h);
	}

	/**
	* @param {number} width
	* @param {number} height
	*/
	setSize(width, height) {
		this.initBlocks(width, height);
		return super.setSize(width, height);;
	}

	/**
	* @param {number} x
	* @param {number} y
	* @param {number} rot
	*/
	updatePositions(x, y, rot) {
		this.center.setPos(x, y);

		let offset = this.block_h;
		for(let i=0; i<((this.blocks.length/4)|0); i++) {
			for(let j=0; j<4; j++) {
				let a = rot + Math.PI / 2.0 * j;

				this.blocks[i*4+j].setPos(
					this.transform.x + Math.cos(a) * offset,
					this.transform.y + Math.sin(a) * offset
				).setRot(a + Math.PI/2.0);
			}
			offset += this.block_gap*2 + this.block_h*2;
		}
	}

	/**
	* @param {number} x
	* @param {number} y
	*/
	setPos(x, y) {
		this.updatePositions(x, y, this.getTransform().rot);
		return super.setPos(x, y);
	}

	/**
	* @param {number} rot
	*/
	setRot(rot) {
		this.updatePositions(this.getTransform().x, this.getTransform().y, rot);
		return super.setRot(rot);
	}

	/**
	 * @param  {number?} dt
	 * @param  {boolean?} paused
	 */
	update(dt, paused = false) {
		this.setRot(this.transform.rot + Math.PI * dt * -0.0003);
		super.update(dt, paused);
	}
}