//@ts-check
import $ from '../../utils/html';
import Object2D, {Type} from '../objects/object2d';

/**
* 	@typedef {{
		x: number, y: number, 
		w: number, h: number, 
		rot: number,
	}} 
	Transform
*/

/**
 * @param {Object2D} selected_object
 * @param {Function} onDeleteOption
 * @param {Function} onCopyOption
 * @param {Function} onTransformUpdate
 * @param {Function} onKeyframesUpdate
 */
export default function(selected_object, onDeleteOption, onCopyOption, onTransformUpdate, 
	onKeyframesUpdate) 
{
	var x_input, y_input, w_input, h_input, rot_input, time_input, keyframes_container, action_btn,
		update_btn;

	/** @type {{time: number, transform: Transform}[]} keyframes array sorted by time */
	let keyframes = JSON.parse(JSON.stringify(selected_object.keyframes || []));

	let frametime_exists = -1;

	function updateKeyframesContainer() {
		keyframes_container.text('');//clear previous content
		
		let time_value = time_input.value;
		frametime_exists = -1;
		for(let frame_id in keyframes) {
			let keyframe_btn = $.create('button').on('click', (e) => {
				//select keyframe by button index
				let frame = keyframes[frame_id];
				time_input.value = frame.time;//update time input
				setTransformInputs(frame.transform);//update transforms
				updateObjectTransform();
				updateKeyframesContainer();
			});
			if(keyframes[frame_id].time == time_value) {
				keyframe_btn.setClass('current');
				frametime_exists = parseInt(frame_id);
			}
			keyframes_container.addChild(keyframe_btn);
		}

		action_btn.text(frametime_exists !== -1 ? 'Usuń klatkę' : 'Ustaw klatkę kluczową');
		update_btn.style.display = frametime_exists !== -1 ? 'inline-block' : 'none';

		onKeyframesUpdate(keyframes, selected_object);
	}

	function getTransform() {
		let new_transform = {
			x: parseFloat(x_input.value),
			y: parseFloat(y_input.value),

			w: parseFloat(w_input.value),
			h: h_input ? parseFloat(h_input.value) : parseFloat(w_input.value),

			rot: rot_input ? (parseInt(rot_input.value)*Math.PI/180.0) : 0
		};
		for(let num of Object.values(new_transform)) {
			if(isNaN(num)) {
				console.warn('Discarding changes due to NaN value');
				return undefined;
			}
		}
		return new_transform;
	}

	/** @param {Transform} transform */
	function setTransformInputs(transform) {
		x_input.value = transform.x;
		y_input.value = transform.y;
		w_input.value = transform.w;
		if(h_input)
			h_input.value = transform.h;
		if(rot_input) {
			rot_input.value = Math.round( (transform.rot*180.0/Math.PI) * 100 ) / 100;
		}
	}

	function updateObjectTransform() {
		let new_transform = getTransform();
		if(new_transform !== undefined)
			onTransformUpdate( new_transform );
	}

	let classes = selected_object.getClassName().split(' ');

	let exception_rot = (selected_object.static || classes.includes('enemy') ||
		classes.includes('cannon')) &&
		!selected_object.getClassName().split(' ').includes('revolving_door');
	let container = $.create('div').addClass('edit-options').addChild(
		$.create('div').addClass('transform-options').addChild(...[
			$.create('label').text('pozycja x'),
			x_input = $.create('input').setAttrib('type', 'number'),

			$.create('label').text('pozycja y'),
			y_input = $.create('input').setAttrib('type', 'number'),

			...((is_circle) => {
				if(is_circle) {
					return [
						$.create('label').text('promień'),
						w_input = $.create('input').setAttrib('type', 'number')
							.setAttrib('min', 0),

						...(() => {
							if(exception_rot) {
								return [
									$.create('label').text('rotacja'),
										rot_input = $.create('input').setAttrib('type', 'number')
										.setAttrib('min', -360).setAttrib('max', 360)
								]
							}
							else
								return [];
						})()
					];
				}
				else {
					return [
						$.create('label').text('szerokość'),
						w_input = $.create('input').setAttrib('type', 'number')
							.setAttrib('min', 0),

						$.create('label').text('wysokość'),
						h_input = $.create('input').setAttrib('type', 'number')
							.setAttrib('min', 0),

						$.create('label').text('rotacja'),
						rot_input = $.create('input').setAttrib('type', 'number')
							.setAttrib('min', -360).setAttrib('max', 360),
					];
				}
			})(selected_object.type === Type.CIRCLE),
		]),

		selected_object.static ? $.create('div').addClass('anim-options').addChild(
			keyframes_container = $.create('div').addClass('keyframes-list'),
			$.create('div').addChild(
				$.create('label').text('Sekunda animacji:'),
				time_input = $.create('input').setAttrib('type', 'number').setAttrib('value', 0)
					.setAttrib('min', 0).on('input', updateKeyframesContainer),
			),
			$.create('div').addChild(
				action_btn = $.create('button').text('Ustaw klatkę kluczową').on('click', () => {
					if(frametime_exists !== -1) {
						keyframes.splice(frametime_exists, 1);
						updateKeyframesContainer();
						return;
					}
					let new_transform = getTransform();
					if(new_transform === undefined)
						return;
					if(keyframes.find(k => k.time == time_input.value))
						return;
					keyframes.push({
						time: parseFloat(time_input.value),
						transform: new_transform
					});
					keyframes = keyframes.sort((a, b) => a.time - b.time);
					updateKeyframesContainer();
				}),
				update_btn = $.create('button').text('Aktualizuj').on('click', () => {
					if(frametime_exists === -1)
						return;
					let new_transform = getTransform();
					if(new_transform === undefined)
						return;
					keyframes[frametime_exists].transform = new_transform;
					updateKeyframesContainer();
				}).setStyle({
					'margin-left': '10px'
				})
			)
		) : undefined,

		$.create('div').addClass('object-options').addChild(
			$.create('button').text('USUŃ').on('click', onDeleteOption),
			$.create('div').setStyle({margin: '5px 0px'}),//separator
			$.create('button').text('KOPIUJ').on('click', onCopyOption)
		)
	);

	try {
		setTransformInputs(selected_object.transform);

		let steps = [0.1, 0.1, 0.1, 0.1, 1];
		[x_input, y_input, w_input, h_input, rot_input].forEach((input, i) => {
			if(input) {
				input.setAttrib('step', steps[i]);
				input.on('input', updateObjectTransform);
			}
		});
	}
	catch(e) {
		console.error(e);
	}

	if(selected_object.static)
		updateKeyframesContainer();

	return container;
}