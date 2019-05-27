//@ts-check
import PowerUpBase from './powerup_base';
import Player from '../player';
import Config from '../../config';

const DURATION = 10000;
const TRANSITION_TIME = 750;

export default class SpeedBoost extends PowerUpBase {
    constructor() {
        super(DURATION);//miliseconds
    }

    /**
     * @param {Player} player
     */
    applyEffect(player) {
        let s = Config.player_size;
        if(DURATION-this.duration_time < TRANSITION_TIME)
            s *= 1.0 - (DURATION-this.duration_time) / TRANSITION_TIME * 0.5;
        else if(this.duration_time > TRANSITION_TIME)
            s *= 0.5;
        else
            s *= 1.0 - (this.duration_time / TRANSITION_TIME) * 0.5;
        player.setSize(s, s);
    }

    /**
     * @param {Player} player
     */
    clearEffect(player) {
        player.setSize(Config.player_size, Config.player_size);
    }
}
