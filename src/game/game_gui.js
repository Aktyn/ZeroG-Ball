//@ts-check
import $ from './../utils/html';
import MapRecords from './../game/map_records';
import Player from './../game/objects/player';
import Common from './../utils/common';
import Switcher from './../utils/switcher';
import Slider from './../utils/slider';

import {OBJECTS, BACKGROUNDS} from './predefined_assets';
import Object2D, {Type} from './objects/object2d';
import MapData, {AVAIBLE_MAPS} from './map_data';
import Settings from './settings';
import SPEECH_COMMANDS, {COMMANDS} from './speech_recognition';

function createClockWidget() {
	let widget = $.create('span').setClass('clock-widget');
	widget.innerHTML = `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
		<circle r="9" cx="10" cy="10"></circle>
		<text x="10" y="15">
			<tspan x="10" dy="0">UmFkZWsK</tspan>
			<tspan x="10" dy="2">S2Fyb2wK</tspan>
		</text>
		
		<line x1="10" y1="10" x2="10" y2="5"/>
		<line x1="10" y1="10" x2="10" y2="1"/>

		<circle r="0.75" cx="10" cy="10" stroke-width="0"></circle>
	</svg>`;
	/** @param {MouseEvent} event */
	widget.onmousedown = (event) => {
		if(event.button !== 2)
			return;
		if(widget.hasClass('open'))
			widget.removeClass('open');
		else
			widget.addClass('open');
		event.preventDefault();
		event.stopPropagation();
	};
	widget.oncontextmenu = () => false;
	return widget;
}

export default class GameGUI {
	constructor(listeners = {}) {
		window.addEventListener('keydown', this.onKeyDown.bind(this), true);
		this.listeners = listeners;
		this.menu_return_confirm = null;

		this.is_view_open = false;
		this.mode = 0;//0
		this.download_export_confirm = null;
		this.map_data = null;
		//this.map_name_holder = '';//AVAIBLE_MAPS[0].name;

		this.selected_asset = null;
		/** @type {Object2D} */
		this.selected_object = null;

		this.container = $.create('div').setClass('game-gui-container mode-0').addChild(
			//HEADER
			this.header = $.create('header')/*.addClass('hidden')*/.addChild(
				$.create('button').addClass('menu-btn').on('click', () => {
					if(!this.header)
						return;
					if(this.header.classList.contains('hidden'))
						this.header.classList.remove('hidden');
					else
						this.header.classList.add('hidden');
				}),
			
				$.create('div').addClass('game-buttons').addChild(
					$.create('button').text('IMPORT').on('click', this.tryImport.bind(this))
				).addChild(
					this.map_export_btn = $.create('button').text('EXPORT')
						.on('click', this.tryExport.bind(this))
				).addChild(
					$.create('button').addClass('restart-btn').text('RESTART').on('click', () => {
						if(this.mode === 0 && typeof this.listeners.onRestart === 'function')
							this.listeners.onRestart();
					})
				),

				this.speech_indicator = $.create('button').addClass('speech-indicator'),
			
				this.modes_panel = $.create('div').addClass('modes'),
			
				$.create('div').addClass('actions').addChild(
					$.create('button').text('USTAWIENIA')
						.on('click', this.showSettings.bind(this)),
					this.menu_return_btn = $.create('button').addClass('exit-btn')
						.text('POWRÓT DO MENU').on('click', this.tryReturnToMenu.bind(this))
				)
			),

			//GUI CENTER
			this.gui_center = $.create('div').addClass('gui-center').on('click', e => {
				if(e.target === this.gui_center && this.is_view_open)
					this.closeView();
			}),

			//EDIT MENU
			$.create('div').addClass('edit-tools').addChild(
				this.main_edit = $.create('div').addClass('main'),

				$.create('div').addClass('tools').addChild(
					$.create('section').addClass('enviroment').addChild(
						this.bg_selector = $.create('div').addClass('background-selector')
					),
					$.create('section').addClass('buttons').addChild(
						$.create('button').text('USUŃ WSZYSTKO').on('click', () => {
							//edit mode
							if(this.mode === 1 && typeof this.listeners.onClearMap === 'function')
								this.listeners.onClearMap();
						}),
						$.create('button').text('COFNIJ').on('click', () => {
							if(this.mode === 1 && typeof this.listeners.undo === 'function')
								this.listeners.undo();
						})
					)
				)
			).on('click', () => {
				if(this.selected_asset !== null) {
					this.selected_asset = null;
					this.listeners.onAssetSelected(null);
				}
			}),

			//GAME INFO
			this.game_info = $.create('div').addClass('game-info').addChild(
				this.map_name = $.create('div').text(''),
				$.create('div').setClass('timer-container').addChild(
					this.elapsed_time = $.create('span').text('00'),
					createClockWidget()
				),
				this.player_hearts = $.create('div').setClass('hearts')
			)
		);

		BACKGROUNDS.forEach((bg, i) => {
			this.bg_selector.addChild(
				$.create('div').text(bg.name).on('click', () => {
					if(this.mode === 1 && typeof this.listeners.selectBackground === 'function')
						this.listeners.selectBackground(i);
					this.bg_selector.removeClass('open');
				}),
			);
		});
		this.bg_selector.addChild(
			$.create('button').text('WYBÓR TŁA').on('click', () => {
				if( this.bg_selector.hasClass('open') )
					this.bg_selector.removeClass('open');
				else
					this.bg_selector.addClass('open');
			})
		);
		
		this.bg_selector.style.setProperty('--open-height', `${(BACKGROUNDS.length+1)*20}px`);

		['GRA', 'EDYCJA'].forEach((mode, i) => {
			let btn = $.create('button').text(mode).setAttrib('id', i).on('click', btn => {
				//console.log(btn.target.id);
				this.modes_panel.getChildren().forEach( ex_btn => ex_btn.disabled = ex_btn.id == i );
				this.changeMode(i);
			});
			if(i === this.mode)//first element
				btn.disabled = true;//btn.setAttrib('disabled', undefined);
			this.modes_panel.addChild(btn);
		});

		this.speech_indicator.on('click', () => {
			if(this.speech_indicator.hasClass('active')) {
				SPEECH_COMMANDS.stop();
				//this.speech_indicator.removeClass('active');
			}
			else {
				SPEECH_COMMANDS.start();
				//this.speech_indicator.addClass('active');
			}
		});
		//setTimeout(() => {
		if(SPEECH_COMMANDS.isActive())
			this.speech_indicator.addClass('active');
		//}, 500);

		SPEECH_COMMANDS.onStart(() => this.speech_indicator.addClass('active'));
		SPEECH_COMMANDS.onEnd(() => this.speech_indicator.removeClass('active'));

		SPEECH_COMMANDS.onCommand('open_settings', () => {
	        console.log('opening settings due to speech command');
	        if(this.is_view_open)
	        	this.closeView();
	        else
	        	this.showSettings();
	    });

		SPEECH_COMMANDS.onCommand('edit', () => {
		    console.log('entering edit mode due to speech command');
		    if(this.mode === 0)
		        this.changeMode(1);
		    else
		        this.changeMode(0);
		    this.modes_panel.getChildren().forEach( ex_btn => ex_btn.disabled = ex_btn.id == this.mode );
        });

        SPEECH_COMMANDS.onCommand('restart', () => {
            console.log('restarting the game due to speech command');
            listeners.onRestart();
        });

        SPEECH_COMMANDS.onCommand('import', () => {
            console.log('opening import window due to speech command');
            this.tryImport();
        });

        SPEECH_COMMANDS.onCommand('export', () => {
            console.log('opening export window due to speech command');
            this.tryExport(true);
        });

        SPEECH_COMMANDS.onCommand('menu', () => {
            console.log('opening menu due to speech command');
            this.tryReturnToMenu(true);
        });

		//this.showSettings();//temp test
		//this.changeMode(1);//temp test
		//this.onMapFinished(1337 * 69);//temp test
	}

	/** @param {KeyboardEvent} e */
	onKeyDown(e) {
		if(e.keyCode === 27) {
			if(this.selected_asset !== null) {
				this.selected_asset = null;
				this.listeners.onAssetSelected(null);
			}
		}
	}

	destroy() {
		window.removeEventListener('keydown', this.onKeyDown.bind(this), true);
	}

	getNode() {
		return this.container;
	}

	changeMode(id) {
		if(this.mode === parseInt(id))
			return;
		this.selected_asset = null;
		// console.log('TODO', id);
		this.mode = parseInt(id);
		this.container.setClass(`game-gui-container mode-${id} ${this.is_view_open ? 'view-open' : ''}`);

		if(this.mode === 1) {//edit mode open
			this.showAssetsList();
			this.game_info.setStyle({'display': 'none'});
		}
		else
			this.game_info.setStyle({'display': 'inline-block'});

		//edit mode pauses game physics, play mode reloads map
		if(typeof this.listeners.onModeChange === 'function')
			this.listeners.onModeChange(this.mode);
	}

	setHealth(health = Player.INITIAL_HEALTH) {
		this.player_hearts.text('');
		for(let i=0; i<health; i++)
			this.player_hearts.addChild($.create('span'));
	}

	/** @param {MapData} data */
	reloadMapData(data) {
		this.bg_selector.getChildren('div').forEach((div, i) => {
			if(i === data.getBackgroundID())
				div.addClass('selected');
			else
				div.removeClass('selected');
		});
		this.setHealth();
	}

	/** @param {number} health */
	onPlayerHpChange(health) {
		this.setHealth(health);
		let damage_effect = $.create('div').setClass('damage-effect');
		if(health <= 0)
			damage_effect.addClass('killed');
		this.container.addChild(damage_effect);
		setTimeout(() => {
			damage_effect.delete();
		}, 5000);
		//if(health <= 0) {
			//TODO - kill player notification
		//}
	}

	/**
	 * @param {string} name
	 */
	setMapName(name) {
		//this.map_name_holder = name;
		this.map_name.text(name);
	}

	/** 
	 * @param {number} time elapsed game time in miliseconds
	 */
	setTimer(time) {
		let t = Common.milisToTime(time|0, ':');
		if(this.elapsed_time.innerText !== t)
			this.elapsed_time.text(t);
	}

	showAssetsList() {
		let container = $.create('div').addClass('assets_container').on('click', e => {
			if(e.target === container && typeof this.listeners.onAssetSelected === 'function') {
				if(this.selected_asset !== null) {
					this.selected_asset = null;
					$('.asset_preview').removeClass('selected');
					this.listeners.onAssetSelected(null);
				}
				//this.gui_center.removeClass('event_cacher');
			}
		});

		const preview_size = 70;

		for(let [obj_name, obj] of Object.entries(OBJECTS)) {
			let obj_preview = $.create('div').addClass(obj.class_name);

			if(obj.shape === MapData.SHAPE_TYPE.RECT) {
				let aspect = obj.width / obj.height;
				let w = preview_size, h = preview_size;
				if(aspect > 1)
					h *= aspect;
				else
					w *= aspect;
				obj_preview.setStyle({
					width: `${w}px`,
					height: `${h}px`,
				});
			}
			else if(obj.shape === MapData.SHAPE_TYPE.CIRCLE) {
				let radius = (preview_size*0.61)|0;
				obj_preview.setStyle({
					width: `${radius}px`,
					height: `${radius}px`,
					'border-radius': `${radius}px`
				});
			}
			let asset_preview = $.create('div').addClass('asset_preview').addClass(obj_name).setStyle({
				width: `${preview_size}px`,
				height: `${preview_size}px`,
			}).addChild( obj_preview );

			if(obj.shape !== MapData.SHAPE_TYPE.RECT) {
				asset_preview.addChild(
					$.create('button').text('DYNAMICZNY').on('click', (e) => {
						this.selectAsset(obj, obj_name, true);
						e.stopPropagation();
					}
				));
			}
			else
				asset_preview.addClass('single_option');

			asset_preview.addChild(
				$.create('button').text('STATYCZNY').on('click', (e) => {
					this.selectAsset(obj, obj_name, false);
					e.stopPropagation();
				}),
				$.create('label').addClass('name-label').text(obj.name)
			);

			container.addChild(asset_preview);
		}

		this.main_edit.text('').addChild( container );
	}

	showObjectEditOptions() {
		var x_input, y_input, w_input, h_input, rot_input;

		let container = $.create('div').addClass('edit_options').addChild(
			$.create('div').addClass('transform-options').addChild(...[
				$.create('label').text('pozycja x'),
				x_input = $.create('input').setAttrib('type', 'number'),

				$.create('label').text('pozycja y'),
				y_input = $.create('input').setAttrib('type', 'number'),

				...(is_circle => {
					if(is_circle) {
						return [
							$.create('label').text('promień'),
							w_input = $.create('input').setAttrib('type', 'number')
								.setAttrib('min', 0),
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
				})(this.selected_object.type === Type.CIRCLE),
			]),

			$.create('div').addClass('object-options').addChild(
				$.create('button').text('USUŃ').on('click', () => {
					if(this.mode === 1 && typeof this.listeners.deleteObject === 'function') {
						this.listeners.deleteObject(this.selected_object);
						this.selectObject(null);
					}
				})
			)
		);

		try {
			x_input.setAttrib('value', this.selected_object.transform.x);
			y_input.setAttrib('value', this.selected_object.transform.y);
			w_input.setAttrib('value', this.selected_object.transform.w);
			if(h_input)
				h_input.setAttrib('value', this.selected_object.transform.h);
			if(rot_input)
				rot_input.setAttrib('value', 
					(this.selected_object.transform.rot * 180.0/Math.PI).toPrecision(2));

			let steps = [0.1, 0.1, 0.1, 0.1, 1];
			[x_input, y_input, w_input, h_input, rot_input].forEach((input, i) => {
				if(input) {
					input.setAttrib('step', steps[i]);
					input.on('input', () => {
						let new_transform = {
							x: parseFloat(x_input.value),
							y: parseFloat(y_input.value),

							w: parseFloat(w_input.value),
							h: h_input ? parseFloat(h_input.value) : parseFloat(w_input.value),

							rot: rot_input ? (parseInt(rot_input.value)*Math.PI/180.0) : 0
						};
						for(let num of Object.values(new_transform)) {
							if(isNaN(num)) {
								console.error('Discarding changes due to NaN value');
								return;
							}
						}

						if(typeof this.listeners.updateObjectTransform !== 'function')
							return;

						if(this.mode === 1)
							this.listeners.updateObjectTransform(this.selected_object, new_transform);
					});
				}
			});
		}
		catch(e) {
			console.error(e);
		}

		this.main_edit.text('').addChild( container );
	}

	selectAsset(obj, name, dynamic = false) {
		$('.asset_preview').removeClass('selected');

		if(this.selected_asset === obj) {
			this.selected_asset = null;
			this.listeners.onAssetSelected(null);
			return;
		}
		this.selected_asset = obj;
		this.selected_asset.dynamic = dynamic;
		$(`.asset_preview.${name}`).addClass('selected');

		this.listeners.onAssetSelected(obj);
	}

	/** @param {Object2D | null} obj */
	selectObject(obj) {
		if(this.selected_object === obj)
			return;
		if(this.selected_object !== null) {
			//unselect object
			this.selected_object.removeClass('selected');
		}

		this.selected_object = obj;

		if(obj !== null) {
			console.log('selecting:', obj);
			obj.addClass('selected');
			this.showObjectEditOptions();
		}
		else
			this.showAssetsList();
	}

	tryImport() {
		$.create('input').setAttrib('type', 'file').setAttrib('accept', '.json,text/json')
			.on('change', (e) => {
				var file = e.target.files[0];
				if (!file)
					return;
				
				let reader = new FileReader();
				reader.onload = (e) => {
					if(typeof this.listeners.onImport === 'function')
						//@ts-ignore
						this.listeners.onImport(e.target.result || '{}');
				};
				reader.readAsText(file);
			}).click();
	}

	tryExport(force = false) {
		if(typeof this.listeners.exportMapData !== 'function')
			return;
		if(this.download_export_confirm === null && !force) {
			this.map_data = 'text/json;charset=utf-8,' + this.listeners.exportMapData();
			this.map_export_btn.text('POBIERZ PLIK');
			this.download_export_confirm = setTimeout(() => {
				this.map_export_btn.text('EXPORT');
				this.map_data = null;
				this.download_export_confirm = null;
			}, 5000);
		}
		else {
			let link = $.create('a').setAttrib('href', `data:${this.map_data}`).setAttrib('download', 'map.json').setStyle({'display': 'none'});
			$(document.body).addChild(link);
			link.click();

			link.delete();

			this.map_export_btn.text('EXPORT');
			this.map_data = null;
			this.download_export_confirm = null;
		}
	}

	tryReturnToMenu(force = false) {
		if(this.menu_return_confirm === null && !force) {
			this.menu_return_btn.text('NA PEWNO?');
			this.menu_return_confirm = setTimeout(() => {
				this.menu_return_btn.text('POWRÓT DO MENU');
				this.menu_return_confirm = null;
			}, 5000);
		}
		else {
			if(typeof this.listeners.onReturnToMenu === 'function') {
				this.listeners.onReturnToMenu();
				this.menu_return_confirm = null;
			}
		}
	}

	closeView() {
		if(this.gui_center)
			this.gui_center.text('');
		else
			throw new Error('no gui center found');

		this.is_view_open = false;
		this.container.removeClass('view-open');
	}

	showSettings() {
		if(!this.gui_center)
			return;
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
		this.gui_center.text('').addChild(
			$.create('div').addClass('view-container').addChild(
				$.create('header').addChild(
					$.create('span'),//separator
					$.create('span').text('Ustawienia'),
					$.create('button').addClass('close-btn').on('click', this.closeView.bind(this))
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
							if(!this.aspect_ratio_label || !this.aspect_ratio_slider)
								return;
							for(let el of [this.aspect_ratio_label, this.aspect_ratio_slider])
								el.setStyle({'display': enabled ? 'none' : 'block'});

							if(enabled) {
								let res = $.getScreenSize();
								Settings.setValue('aspect_ratio', res.width / res.height);
							}
						}).setEnabled( auto_aspect ).getWidget(),

						this.aspect_ratio_label = $.create('label').text('Proporcje').setStyle({
							'display': auto_aspect ? 'none' : 'block'
						}),
						this.aspect_ratio_slider = new Slider(1, 4, value => {
							Settings.setValue('aspect_ratio', value);
						}).setValue( Number(Settings.getValue('aspect_ratio')) ).getWidget().setStyle({
							'display': auto_aspect ? 'none' : 'block'
						}),
						/*$.create('div').setClass('single-row').addChild(
							$.create('button').text('DOPASUJ PROPORCJE').on('click', e => {
								let res = $.getScreenSize();
								Settings.setValue('aspect_ratio', res.width / res.height);
								this.showSettings();
							})
						)*/
					),

					$.create('hr'),
					$.create('h3').text('Rozpoznawanie mowy'),
					sr_container,

					$.create('hr'),

					$.create('div').addChild(
						$.create('button').text('ZRESETUJ').on('click', () => {
							Settings.reset();
							this.showSettings();
						})
					)
				)
			)
		);

		this.is_view_open = true;
		this.container.addClass('view-open');
	}

	/**
	 * @param  	{string} name name of completed map
	 * @param  	{number} time elapsed time in miliseconds
	 * @param  	{boolean} edited
	 * @param 	{any} map_data
	 */
	onMapFinished(name, time, edited, map_data) {
		this.closeView();
		//console.log(name, time, edited, map_data);

		if(edited) {
			this.container.text('').addClass('finished').addChild(
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
					this.map_export_btn = $.create('button').text('EXPORTUJ')
						.on('click', this.tryExport.bind(this)),
					$.create('br'),
					/*this.map_export_btn = $.create('button').text('POWTÓRZ').on('click', () => {
						if(typeof this.listeners.onMapStart === 'function')
							this.listeners.onMapStart( {
								name: this.map_name.innerText,
								json: map_data
							} );
					}).setStyle({
						'margin-top': '10px'
					}),
					$.create('br'),*/
					this.menu_return_btn = $.create('button').addClass('exit-btn')
						.text('POWRÓT DO MENU').on('click', this.tryReturnToMenu.bind(this)).setStyle({
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
					if(typeof this.listeners.onMapStart === 'function')
						this.listeners.onMapStart(next_map);
				})
			);
		}

		this.container.text('').addClass('finished').addChild(
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
						new_record ? 'Nowy rekord!' : `Rekord: ${Common.milisToTime(current_record, ' ', {
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
					if(typeof this.listeners.onMapStart === 'function')
						this.listeners.onMapStart( AVAIBLE_MAPS.find(map => map.name === name) );
				}),
				$.create('br'),
				this.menu_return_btn = $.create('button').addClass('exit-btn')
					.text('POWRÓT DO MENU').on('click', this.tryReturnToMenu.bind(this)).setStyle({
						'margin-top': '10px'
					})
			)
		);
	}
}
