//@ts-check
import Object2D, {Type} from './object2d';
import SvgEngine from './../svg_engine';
import SimplePhysics from './../simple_physics/engine';
// import CollisionCategories from './collision_categories';
import {OBJECTS} from "../predefined_assets";

export default class Elevator extends Object2D {
    /**
     * @param {number} w
     * @param {number} h
     * @param {SvgEngine} graphics_engine
     * @param {SimplePhysics} physics_engine
     * @param {Object2D[]} objects handle for objects array that are part of map
     */
    constructor(w, h, graphics_engine, physics_engine, objects) {
        super(Type.RECT, w, h, graphics_engine, physics_engine);
        this.objects = objects;
        this.body.setMask(0);

        // this.door1 = new Object2D(Type.RECT, 0.01, 0.12, graphics_engine, physics_engine);
        // this.door2 = new Object2D(Type.RECT, 0.01, 0.12, graphics_engine, physics_engine);
        this.wall1 = new Object2D(Type.RECT, OBJECTS.elevator.width + OBJECTS.elevator.width * 0.1, OBJECTS.elevator.height * 0.06, graphics_engine, physics_engine);
        this.wall1.setClass('orange');
        this.wall2 = new Object2D(Type.RECT, OBJECTS.elevator.width + OBJECTS.elevator.width * 0.1, OBJECTS.elevator.height * 0.06, graphics_engine, physics_engine);
        this.wall2.setClass('orange');

        this.elevatorActive = false;
        this.timer = 1000;
        this.locked = 0;

        objects.push(this.wall1, this.wall2);
    }

    onPlayerEnter(player) {
        if(this.elevatorActive) return;

        let playerX = player.getTransform().x;
        let playerY = player.getTransform().y;
        let elevatorX = this.getTransform().x;
        let elevatorY = this.getTransform().y;

        let d = Math.sqrt(Math.pow(playerX - elevatorX, 2)) + Math.sqrt(Math.pow(playerY - elevatorY, 2));
        if(d<=0.01 && this.locked === 0) {
            this.elevatorActive = true;
            this.locked = 300;
        }

        // console.log('odleglosc od windy: ' + d + ' ' + this.elevatorActive);
    }

    /** @param {number} dt */
    update(dt) {
        // this.door1.setPos(
        //     this.getTransform().x - 0.13,
        //     this.getTransform().y
        // );
        //
        // this.door2.setPos(
        //     this.getTransform().x + 0.13,
        //     this.getTransform().y
        // );

        this.wall1.setPos(
            this.getTransform().x,
            this.getTransform().y - 0.13
        );

        this.wall2.setPos(
            this.getTransform().x,
            this.getTransform().y + 0.13
        );

        if(this.elevatorActive) {
            this.timer -= dt;
            // console.log('timer ' + timer);
            if(this.timer/1000 > 0) {
                super.setPos(this.getTransform().x, this.getTransform().y + Math.PI * dt * -0.0002);
            } else {
                this.elevatorActive = false;
                this.timer = 1000;
            }
        }

        // console.log('locked ' + this.locked);
        if(!this.elevatorActive && this.locked > 0) this.locked--;

        super.update(dt);
    }
}
