//@ts-check
import PowerUpBase from './powerup_base';
import Player from '../player';

export default class SpeedBoost extends PowerUpBase {
    constructor() {
        super(5000);//miliseconds
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
