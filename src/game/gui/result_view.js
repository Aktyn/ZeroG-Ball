//@ts-check
import $ from '../../utils/html';
import Common from '../../utils/common';
import GameGUI from '../game_gui';
import MapRecords from '../../game/map_records';
import {AVAIBLE_MAPS} from '../map_data';

export default {
	/**
	 * @param 	{GameGUI} gui
	 * @param 	{any} target_element
	 * @param  	{string} name name of completed map
	 * @param  	{number} time elapsed time in miliseconds
	 * @param  	{boolean} edited
	 * @param 	{any} map_data
	 */
	open: (gui, target_element, name, time, edited, map_data) => {
		if(edited) {
			target_element.text('').addClass('finished').addChild(
				$.create('article').addChild(
					$.create('h1').text('GRATULACJE!'),
					$.create('div').addChild(
						$.create('span').text('Własny poziom ukończony w czasie: '),
						$.create('strong').text(Common.milisToTime(time, ' ', {
							hours: ' godzin',
							minutes: ' minut',
							seconds: ' sekund'
						}))
					),
					$.create('hr'),
					gui.map_export_btn = $.create('button').text('EXPORTUJ')
						.on('click', gui.tryExport.bind(gui)),
					$.create('br'),
					/*gui.map_export_btn = $.create('button').text('POWTÓRZ').on('click', () => {
						if(typeof gui.listeners.onMapStart === 'function')
							gui.listeners.onMapStart( {
								name: gui.map_name.innerText,
								json: map_data
							} );
					}).setStyle({
						'margin-top': '10px'
					}),
					$.create('br'),*/
					gui.menu_return_btn = $.create('button').addClass('exit-btn')
						.text('POWRÓT DO MENU').on('click', gui.tryReturnToMenu.bind(gui)).setStyle({
							'margin-top': '10px'
						})
				)
			);
			return;
		}

		let current_record = MapRecords.getRecord(name);
		let new_record = current_record === null ? true : (current_record > time);

		let current_map_index = AVAIBLE_MAPS.findIndex(map => map.name === name);
		let next_map = AVAIBLE_MAPS[current_map_index+1] || null;

		let next_map_info = $.create('div');

		if(next_map === null)
			next_map_info.text('Wszystkie poziomy w grze zostały odblokowane. Gratulacje.');
		else {
			next_map_info.addChild(
				$.create('label').text('Nowy poziom odblokowany: ').addChild(
					$.create('strong').text( next_map.name )
				),
				$.create('br'),
				$.create('button').text('GRAJ').setStyle({
					'margin-top': '5px',
					'border': '1px solid #B0BEC5'
				}).on('click', () => {
					if(typeof gui.listeners.onMapStart === 'function')
						gui.listeners.onMapStart(next_map);
				})
			);
		}

		target_element.text('').addClass('finished').addChild(
			$.create('article').addChild(
				$.create('h1').text('GRATULACJE!'),
				$.create('div').text('Ukończony poziom: ').addChild(
					$.create('strong').text( name )
				),
				$.create('div').text('Twój czas: ').addChild(
					$.create('strong').text( Common.milisToTime(time, ' ', {
						hours: ' godzin', 
						minutes: ' minut',
						seconds: ' sekund'
					}))
				),
				$.create('div').setClass(new_record ? 'record-info' : '')
					.text(
						new_record ? 'Nowy rekord!' : `Rekord: ${Common.milisToTime(current_record, ' ', 
						{
							hours: ' godzin', 
							minutes: ' minut',
							seconds: ' sekund'
						})}`
					),
				$.create('hr'),

				$.create('div').setClass('nextlvl-info').addChild(
					next_map_info
				),

				$.create('hr'),
				$.create('button').text('POWTÓRZ POZIOM').on('click', () => {
					if(typeof gui.listeners.onMapStart === 'function')
						gui.listeners.onMapStart( AVAIBLE_MAPS.find(map => map.name === name) );
				}),
				$.create('br'),
				gui.menu_return_btn = $.create('button').addClass('exit-btn')
					.text('POWRÓT DO MENU').on('click', gui.tryReturnToMenu.bind(gui)).setStyle({
						'margin-top': '10px'
					})
			)
		);
	}
}