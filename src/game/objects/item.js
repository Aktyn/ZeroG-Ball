//@ts-check
import Object2D, {Type} from './object2d';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';
import CollisionCategories from './collision_categories';
import Player from './player';
import SpeedBoost from './powerups/speedboost';
import Shrinker from './powerups/shrinker';

export default class Item extends Object2D {
    /**
     * @param {number} w
     * @param {number} h
     * @param {SvgEngine} graphics_engine
     * @param {SimplePhysics} physics_engine
     * @param {string} type
     */
    constructor(w, h, graphics_engine, physics_engine, type) {
        super(Type.CIRCLE, w, h, graphics_engine, physics_engine);
        this.body.setMask(
            ~CollisionCategories.player
        );
        switch(type) {
            default://any chosen powerup should be defaulted
            case 'speedboost':
                this.powerUp = new SpeedBoost(type);
                break;
            case 'shrinker':
                this.powerUp = new Shrinker(type);
                break;
        }
    }

    /**
     * @param {Player} player
     * @returns {boolean}
     */
    use(player) {
        if(player.isPowerupActive(this.powerUp))
            return false;
        player.addPowerUp(this.powerUp);
        return true;
    }
}
