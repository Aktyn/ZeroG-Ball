//@ts-check
import GameCore from './game_core';
import {STATE} from './map';

import Object2D, {Type} from './objects/object2d';
import Portal from './objects/portal';
import Cannon from './objects/cannon';
import Bullet from './objects/bullet';
import Door from './objects/door';
import Key from './objects/key';
import Elevator from './objects/elevator';
import Exit from './objects/exit';
import Forcefield from './objects/forcefield';
import Sawblade from './objects/sawblade';
import SpikyCrate from './objects/spiky_crate';
import Aid from './objects/aid';
import Player from './objects/player';
import Enemy from './objects/enemy';
import EnemySensor from './objects/enemy_sensor';
import Item from './objects/item';

import {Body} from './simple_physics/body';
import Filter from './simple_physics/filter';

/**
 * @param  {GameCore} game_core
 * @param  {Body} A
 * @param  {Body} B
 */
export default function handleCollision(game_core, A, B) {
	/** @type {Object2D} */
	let objA = A.getCustomData();
	/** @type {Object2D} */
	let objB = B.getCustomData();

	if(objA instanceof Player) {
		if(objB instanceof Elevator)
			objB.onPlayerEnter(objA);
		else if(objB instanceof Exit) {
			console.log('Level completed');
			
			game_core.state = STATE.FINISHED;
			if(typeof game_core.listeners.onMapFinished === 'function') {
				game_core.listeners.onMapFinished(game_core.map_data.name, 
					game_core.elapsed_time, game_core.map_data.wasEdited);
			}
		}
		else if(objB instanceof Forcefield)
			objB.activate(game_core.player);
		else if((objB instanceof Sawblade) || (objB instanceof SpikyCrate) || (objB instanceof Bullet))
			objA.damage(1);
		else if(objB instanceof Aid) {
			objA.damage(-1);//heal player
			objB.to_destroy = true;
		}
		else if(objB instanceof EnemySensor)
			objB.owner.onPlayerInRange(objA);
		else if(objB instanceof Enemy) {
			//TODO - explosion effect (can be added as object via game_core handle)
			objA.damage(1);
			objB.to_destroy = true;
		}
		else if(objB instanceof Item) {
			objB.to_destroy = true;
			objB.use(objA);
		}

	}
	else if(objA instanceof Portal) {
		/** @type {Object2D} */
		let target_obj = objB;
		//static object and other portals doesn't teleport
		if(target_obj.static || target_obj instanceof Portal)
			return;

		//get another portal instance with same type
		/** @type {Portal} collided portal handle */
		let p = objA;

		if(Filter.collide(target_obj.body, p.body))
			return;

		/** @type {Portal[]} [potential destination portals] */
		let other_portals = [];

		for(let obj of game_core.objects) {
			if(obj !== p && obj instanceof Portal && obj.portal_type === p.portal_type && !obj.locked)
				other_portals.push(obj);
		}

		//get random target portal and init teleportation
		if(other_portals.length > 0)
			p.teleport( other_portals[ (Math.random()*other_portals.length)|0 ], target_obj );
	}
	else if(objA instanceof Bullet && !(objB instanceof Portal) && !(objB instanceof Cannon)) {
		if(Filter.collide(objA.body, objB.body))
			objA.to_destroy = true;
	}
	else if((objB instanceof Door) && (objA instanceof Key)) {
		/** @type {Door} */
		let door = objB;
		/** @type {Key} */
		let key = objA;

		if(door.door_type === key.key_type)//compatible key and door
			door.open(key);
	}
}
