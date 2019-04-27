//@ts-check
import GameCore from './game_core';
import {STATE} from './map';
import Object2D, {Type} from './objects/object2d';
import {Body} from './simple_physics/body';

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
				//game_core.onPlayerDamage(1);
				game_core.player.damage(1);
				break;
			case 'forcefield':
				B.getCustomData().activate(game_core.player);
				break;
		}
	}
}