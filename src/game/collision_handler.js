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
import Player from './objects/player';

import {Body} from './simple_physics/body';
import Filter from './simple_physics/filter';

/**
 * @param  {GameCore} game_core
 * @param  {Body} A
 * @param  {Body} B
 */
export default function handleCollision(game_core, A, B) {
	let objA = A.getCustomData();
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
			game_core.player.damage(1);
	}
	if(objA instanceof Portal) {
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

	if(objA instanceof Bullet && !(objB instanceof Portal) && !(objB instanceof Cannon)) {
		/** @type {Bullet} */
		objA.to_destroy = true;
	}

	if((objB instanceof Door) && (objA instanceof Key)) {
		/** @type {Door} */
		let door = objB;
		/** @type {Key} */
		let key = objA;

		if(door.door_type === key.key_type)//compatible key and door
			door.open(key);
	}
}
