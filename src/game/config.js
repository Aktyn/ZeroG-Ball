// @ts-check
const physic_step = 1 / 60;

export default {
	//graphics
	// --- moved to settings ---	ASPECT: 1280/720,//width / height
	VIRT_SCALE: 720,

	//physics (simple)
	PHYSIC_STEP: physic_step,
	//ITERATIONS: 10,
	EPSILON: 0.00001,//0.0001
	SCALLER: 20,//physic body values scaller

	//gameplay
	MAX_RANGE: 50,//objects further, from center of the map, then this value will be deleted
	player_size: 0.1,
	forcefield_duration: 15
};