//@ts-check
import GameCore from './game_core';
import {STATE} from './map';
import Object2D, {Type} from './objects/object2d';
import Portal from './objects/portal';
import {Body} from './simple_physics/body';
import Filter from './simple_physics/filter';

/**
 * @param  {GameCore} game_core
 * @param  {Body} A
 * @param  {Body} B
 */
export default function handleCollision(game_core, A, B) {
	if(A.getCustomData() === game_core.player) {
		switch(B.getCustomData().getClassName()) {
			case 'exit':
				console.log('Level completed');
				
				game_core.state = STATE.FINISHED;
				if(typeof game_core.listeners.onMapFinished === 'function') {
					game_core.listeners.onMapFinished(game_core.map_data.name, 
						game_core.elapsed_time, game_core.map_data.wasEdited);
				}
				break;
			case 'sawblade':
				game_core.player.damage(1);
				break;
			case 'forcefield':
				B.getCustomData().activate(game_core.player);
				break;
		}
	}
	if(A.getCustomData() instanceof Portal) {
		/** @type {Object2D} */
		let target_obj = B.getCustomData();
		//static object and other portals doesn't teleport
		if(target_obj.static || target_obj instanceof Portal)
			return;

		//get another portal instance with same type
		/** @type {Portal} collided portal handle */
		let p = A.getCustomData();

		if(Filter.collide(target_obj.body, p.body))
			return;

		/** @type {Portal[]} [potential destination portals] */
		let other_portals = [];

		for(let obj of game_core.objects) {
			if(obj !== p && obj instanceof Portal && obj.type === p.type && !obj.locked)
				other_portals.push(obj);
		}

		//get random target portal and init teleportation
		if(other_portals.length > 0)
			p.teleport( other_portals[ (Math.random()*other_portals.length)|0 ], target_obj );
	}
}