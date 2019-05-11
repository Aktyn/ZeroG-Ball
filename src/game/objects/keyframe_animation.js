import Object2D from './object2d';

/**
 * @param {number} a first mixing value
 * @param {number} b second mixing value
 * @param {number} factor value between 0 and 1
 */
function mix(a, b, factor) {
	return a * (1.0 - factor) + b * factor;
}

/**
 * @param  {Object2D} obj animating object
 * @param  {number} dt delta time
 */
export default function(obj, dt) {
	let next_frame_id = obj.keyframe_id+1;

	let current_frame = obj.keyframes[obj.keyframe_id];
	let next_frame = obj.keyframes[next_frame_id];
	let last_frame = obj.keyframes[obj.keyframes.length-1];

	let factor = (obj.animation_time - current_frame.time) / (next_frame.time - current_frame.time);
	factor = Math.max(0, Math.min(1, factor));

	let mixed = {
		x: mix(current_frame.transform.x, next_frame.transform.x, factor),
		y: mix(current_frame.transform.y, next_frame.transform.y, factor),
		w: mix(current_frame.transform.w, next_frame.transform.w, factor),
		h: mix(current_frame.transform.h, next_frame.transform.h, factor),
		rot: mix(current_frame.transform.rot, next_frame.transform.rot, factor)
	};

	let t = obj.getTransform();//helper variable
	if(t.x !== mixed.x || t.y !== mixed.y)
		obj.setPos(mixed.x, mixed.y);
	if(t.w !== mixed.w || t.h !== mixed.h)
		obj.setSize(mixed.w, mixed.h);
	if(t.rot !== mixed.rot)
		obj.setRot(mixed.rot);

	obj.animation_time += dt/1000.0;

	if( obj.animation_time >= last_frame.time ) {//loop to beginning
		obj.animation_time -= last_frame.time;
		obj.keyframe_id = 0;
	}
	else if(obj.animation_time >= next_frame.time) {
		obj.keyframe_id = (obj.keyframe_id+1) % (obj.keyframes.length-1);//go to next keyframe
	}
}