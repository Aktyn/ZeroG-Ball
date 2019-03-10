import {Vec2} from './physics/math';

export default {
	//graphics
	ASPECT: 1280/720,//width / height
	VIRT_SCALE: 720,//1<<10

	//physics
	gravityScale: 5.0,//*10
	gravity: new Vec2(0, 10. * 5.0),//5.0 - gravityScale
	//(Config.step * Config.gravity).LenSqr()
	gravity_step: new Vec2(0, 10. * 5.0 / 60.0).LenSqr(),//this.step * 10.*this.gravityScale
	step: 1 / 60
}