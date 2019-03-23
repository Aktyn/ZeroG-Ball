// @ts-check
import {Vec2} from './physics/math';

const gravity_scale = 5.0;

const gravity = 0;//9.807;
const physic_step = 1 / 60;

export default {
	//graphics
	ASPECT: 1280/720,//width / height
	VIRT_SCALE: 720,//1<<10

	PHYSICS_ENGINE: 'simple',//'simple', 'advanced'

	//physics (simple)
	PHYSIC_STEP: physic_step,
	ITERATIONS: 10,
	gravity: gravity,// * 0.01,
	gravity_step_sqr: Math.pow(gravity*physic_step, 2),

	//physics (advanced)
	gravityScale: gravity_scale,//5.0,//*10
	gravity_vec: new Vec2(0, 10. * gravity_scale),//5.0 - gravityScale
	//(Config.step * Config.gravity).LenSqr()
	gravity_step: new Vec2(0, 10. * gravity_scale / 60.0).LenSqr(),
	//this.step * 10.*this.gravityScale
	//step: 1 / 60,
	EPSILON: 0.00001,//0.0001
};