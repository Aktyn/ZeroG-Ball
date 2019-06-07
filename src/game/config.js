<<<<<<< HEAD
<<<<<<< HEAD
import {Vec2} from './physics/math';

const gravity_scale = 5.0;

export default {
	//graphics
	ASPECT: 1280/720,//width / height
	VIRT_SCALE: 720,//1<<10

	//physics
	gravityScale: gravity_scale,//5.0,//*10
	gravity: new Vec2(0, 10. * gravity_scale),//5.0 - gravityScale
	//(Config.step * Config.gravity).LenSqr()
	gravity_step: new Vec2(0, 10. * gravity_scale / 60.0).LenSqr(),//this.step * 10.*this.gravityScale
	step: 1 / 60,
	EPSILON: 0.00001//0.0001
}
=======
// @ts-check
//const gravity_scale = 5.0;
//const gravity = 0;//9.807;
=======
// @ts-check
>>>>>>> origin/stage3
const physic_step = 1 / 60;

export default {
	//graphics
	// --- moved to settings ---	ASPECT: 1280/720,//width / height
	VIRT_SCALE: 720,

	//physics (simple)
	PHYSIC_STEP: physic_step,
	//ITERATIONS: 10,
	EPSILON: 0.00001,//0.0001
<<<<<<< HEAD

	//gameplay
	player_size: 0.1,
	forcefield_duration: 15
};
>>>>>>> stage3
=======
	SCALLER: 20,//physic body values scaller

	//gameplay
	MAX_RANGE: 50,//objects further, from center of the map, then this value will be deleted
	player_size: 0.1,
	forcefield_duration: 15
};
>>>>>>> origin/stage3
