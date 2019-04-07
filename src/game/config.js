// @ts-check
//const gravity_scale = 5.0;
//const gravity = 0;//9.807;
const physic_step = 1 / 60;

export default {
	//graphics
	// --- moved to settings ---	ASPECT: 1280/720,//width / height
	VIRT_SCALE: 720,

	//physics (simple)
	PHYSIC_STEP: physic_step,
	//ITERATIONS: 10,
	EPSILON: 0.00001,//0.0001

	//gameplay
	player_size: 0.1
};