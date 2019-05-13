//@ts-check
import $ from '../../utils/html';
import Switcher from '../../utils/switcher';
import Slider from '../../utils/slider';
import Settings from '../settings';
import {COMMANDS} from '../speech_recognition';

const Self = {
	/** @param {any} target_element */
	open: (target_element, close_view_listener) => {
		let auto_aspect = !!Settings.getValue('aspect_auto');
		var commands_desc = {
			'open_settings': 'Otwórz ustawienia',
            'edit': 'Edytuj mapę',
            'restart': 'Restart rozgrywki',
            'import': 'Zaimportuj mapę',
            'export': 'Wyeksportuj mapę',
            'menu': "Powrót do menu"
		};
		var sr_container = $.create('div').setClass('settings');

		let aspect_ratio_label;
		let aspect_ratio_slider;
		
		for(let command in COMMANDS) {
			let keyword_input = $.create('input').setAttrib('type', 'text')
				.setAttrib('value', COMMANDS[command].join(', ')).on('change', e => {
					//console.log( command, keyword_input.value );
					Settings.setValue(command, keyword_input.value);
					//update with proper formating
					setTimeout(() => keyword_input.value = COMMANDS[command].join(', '), 10);
				});

			sr_container.addChild( $.create('label').text(commands_desc[command]), keyword_input );
		}
		target_element.text('').addChild(
			$.create('div').addClass('view-container').addChild(
				$.create('header').addChild(
					$.create('span'),//separator
					$.create('span').text('Ustawienia'),
					$.create('button').addClass('close-btn').on('click', close_view_listener)
				)
			).addChild(
				$.create('article').addChild(
					$.create('div').setClass('settings').addChild(
						$.create('label').text('Cienie'),
						new Switcher(enabled => {
							Settings.setValue('shadows', enabled);
						}).setEnabled( !!Settings.getValue('shadows') ).getWidget(),

						$.create('label').text('Textury'),
						new Switcher(enabled => {
							Settings.setValue('textures', enabled);
						}).setEnabled( !!Settings.getValue('textures') ).getWidget(),

						$.create('label').text('Auto proporcje'),
						new Switcher(enabled => {
							Settings.setValue('aspect_auto', enabled);
							if(!aspect_ratio_label || !aspect_ratio_slider)
								return;
							for(let el of [aspect_ratio_label, aspect_ratio_slider])
								el.setStyle({'display': enabled ? 'none' : 'block'});

							if(enabled) {
								let res = $.getScreenSize();
								Settings.setValue('aspect_ratio', res.width / res.height);
							}
						}).setEnabled( auto_aspect ).getWidget(),

						aspect_ratio_label = $.create('label').text('Proporcje').setStyle({
							'display': auto_aspect ? 'none' : 'block'
						}),
						aspect_ratio_slider = new Slider(1, 4, value => {
							Settings.setValue('aspect_ratio', value);
						}).setValue( Number(Settings.getValue('aspect_ratio')) ).getWidget().setStyle({
							'display': auto_aspect ? 'none' : 'block'
						}),
					),

					$.create('hr'),
					$.create('h3').text('Rozpoznawanie mowy'),
					sr_container,

					$.create('hr'),

					$.create('div').addChild(
						$.create('button').text('ZRESETUJ').on('click', () => {
							Settings.reset();
							//this.showSettings();
							Self.open(target_element, close_view_listener);
						})
					)
				)
			)
		);
	}
}

export default Self;