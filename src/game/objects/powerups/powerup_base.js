//@ts-check
import _Player from '../player';
export default class PowerUpBase {
	/**
	 * @param {string} type
	 * @param {number} duration_time duration of powerup in miliseconds
	 */
	constructor(type, duration_time) {
		this.type = type;
		this.duration_time = duration_time;
	}

	/**
	 * @param {Player} player
	 */
	applyEffect(_player) {
		throw new Error('this method must be implemented in child object');
	}

	/**
	 * @param {Player} player
	 */
	clearEffect(_player) {
		throw new Error('this method must be implemented in child object');
	}
}
