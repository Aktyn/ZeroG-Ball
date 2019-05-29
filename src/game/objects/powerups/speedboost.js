//@ts-check
import PowerUpBase from './powerup_base';
import Player from '../player';

export default class SpeedBoost extends PowerUpBase {
    /** @param {string} type */
    constructor(type) {
        super(type, 5000);//miliseconds
    }

    /**
     * @param {Player} player
     */
    applyEffect(player) {
        player.toogleSpeed(true);
    }

    /**
     * @param {Player} player
     */
    clearEffect(player) {
        player.toogleSpeed(false);
    }
}
