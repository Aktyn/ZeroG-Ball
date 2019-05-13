//@ts-check
import Object2D, {Type} from './object2d';
import Player from './player';
import CollisionCategories from './collision_categories';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';
import Config from './../config';

const TELEPORT_DISTANCE = 0.1;
const INITIAL_SUCKING_SPEED = 0.008;
const SUCKING_ACCELERATION = 0.001;

export default class Portal extends Object2D {
	/**
	* @param {number} w
	* @param {number} h
	* @param {SvgEngine} graphics_engine
	* @param {SimplePhysics} physics_engine
	* @param {number} _type
	*/
	constructor(w, h, graphics_engine, physics_engine, _type) {
		super(Type.CIRCLE, w, h, graphics_engine, physics_engine);

		this.portal_type = _type;
		//everything except ...
		this.body.setMask(//list of filters that portal can teleport
			~CollisionCategories.player & 
			~CollisionCategories.sawblade & 
			~CollisionCategories.exit_portal &
			~CollisionCategories.bullet &
			~CollisionCategories.key &
			~CollisionCategories.aid &
			~CollisionCategories.enemy
		);

		/** @type {Object2D} teleporting object */
		this.obj = null;
		/** @type {Portal} destination portal */
		this.dest_portal = null;

		this.suckingSpeed = 0;

		this.locked = 0;
	}

	/**
	 * @param  {Portal} _dest_portal destination portal
	 * @param  {Object2D} _obj dynamic object that will be teleported
	 */
	teleport(_dest_portal, _obj) {
		if(this.locked > 0) {
			this.locked = Math.min(10, this.locked+1);
			return;
		}
		if(this.obj !== null)
			return;
		this.dest_portal = _dest_portal;
		this.obj = _obj;
		this.suckingSpeed = INITIAL_SUCKING_SPEED;
	}

	/** 
	 * @param  {number?} dt
	 * @param  {boolean?} paused
	 */
	update(dt, paused = false) {
		if(this.obj !== null) {
			let dx = this.obj.getTransform().x - this.getTransform().x;
			let dy = this.obj.getTransform().y - this.getTransform().y;

			let factor = Math.min(1, dt * this.suckingSpeed);
			this.obj.setPos(//sucking to the center of portal
				this.obj.getTransform().x - dx * factor,
				this.obj.getTransform().y - dy * factor,
			);
			this.suckingSpeed += SUCKING_ACCELERATION;

			if(dx*dx + dy*dy < TELEPORT_DISTANCE*TELEPORT_DISTANCE) {
				this.obj.setPos(this.dest_portal.getTransform().x, this.dest_portal.getTransform().y);
				this.dest_portal.locked = 10;
				this.obj = null;
				this.dest_portal = null;
			}
		}
		else if(this.locked > 0)
			this.locked--;

		super.setRot(this.transform.rot + Math.PI * dt * -0.0003);
		super.update(dt, paused);
	}
}