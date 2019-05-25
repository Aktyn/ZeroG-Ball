//@ts-check
import Player from '../player';
export default class PowerUpBase {

    /**
     * @param {number} duration_time duration of powerup in miliseconds
     */
    constructor(duration_time) {
        this.duration_time = duration_time;
    }

    /**
     * @param {Player} player
     */
    applyEffect(player) {
        throw new Error('this method must be implemented in child object');
    }

    /**
     * @param {Player} player
     */
    clearEffect(player) {
        throw new Error('this method must be implemented in child object');
    }
}
