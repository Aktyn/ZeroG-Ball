//@ts-check
import $ from './../utils/html';
import Player from './../game/objects/player';
import Common from './../utils/common';

import ResultView from './gui/result_view';
import SettingsView from './gui/settings_view';

import editObjectOptions from './gui/object_edit_code';

import {OBJECTS, BACKGROUNDS, CATEGORIES} from './predefined_assets';
import Object2D, {Type} from './objects/object2d';
import PowerUpBase from './objects/powerups/powerup_base';
import MapData from './map_data';

import SPEECH_COMMANDS from './speech_recognition';
import MapRecords from "./map_records";
import ServerApi from "../utils/server_api";

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

		this.player_health = Player.INITIAL_HEALTH;

		this.container = $.create('div').setClass('game-gui-container mode-0');
		this.initGUI();
		
		if(SPEECH_COMMANDS.isActive())
			this.speech_indicator.addClass('active');

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
		//this.onMapFinished(1337 * 69);//temp test
		//setTimeout(() => this.changeMode(1), 1);//temp test
	}

	initGUI() {
		this.container.text('').addChild(
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
					$.create('button').text('IMPORT').on('click', () => {
						this.tryImport();
						//@ts-ignore
						document.activeElement.blur();
					})
				).addChild(
					this.map_export_btn = $.create('button').text('EXPORT')
						.on('click', () => {
							this.tryExport();
							//@ts-ignore
							document.activeElement.blur();
						})
				).addChild(
					$.create('button').addClass('restart-btn').text('RESTART').on('click', () => {
						if(this.mode === 0 && typeof this.listeners.onRestart === 'function')
							this.listeners.onRestart();
						//@ts-ignore
						document.activeElement.blur();
					})
				),

				//$.create('div').addChild(
					this.speech_indicator = $.create('button').addClass('speech-indicator'),
				//),

				this.modes_panel = $.create('div').addClass('modes'),

				$.create('div').addClass('actions').addChild(
					$.create('button').text('USTAWIENIA')
						.on('click', () => {
							this.showSettings();
							//@ts-ignore
							document.activeElement.blur();
						}),
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
				this.main_edit = $.create('div').addClass('main').on('mousewheel', e => {
					this.main_edit.scrollLeft += e.deltaY;
				}),

				$.create('div').addClass('tools').addChild(
					this.asset_categories = $.create('section').addClass('categories'),
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
					$('.asset_preview.selected').removeClass('selected');
					this.listeners.onAssetSelected(null);
				}
			}),

			//GAME INFO
			this.game_info = $.create('div').addClass('game-info').addChild(
				this.map_name = $.create('div').text('zmieniona mapa'),
				this.local_best_time = $.create('div').text('').setStyle({display: 'none'}),
				this.server_best_time = $.create('div').text('').setStyle({display: 'none'}),
				$.create('div').setClass('timer-container').addChild(
					this.elapsed_time = $.create('span').text('00'),
					createClockWidget()
				),
				this.player_hearts = $.create('div').setClass('hearts'),
				this.active_powerups = $.create('div').setClass('powerups')
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

		for(let cat of Object.values(CATEGORIES)) {
			this.asset_categories.addChild(
				$.create('button').text(cat).on('click', () => {
					this.showAssetsList(cat);
				})
			);
		}

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
			if(this.speech_indicator.hasClass('active'))
				SPEECH_COMMANDS.stop()
			else
				SPEECH_COMMANDS.start();
		});
	}

	/** @param {KeyboardEvent} e */
	onKeyDown(e) {
		if(e.keyCode === 27) {//esc
			if(this.selected_asset !== null) {
				this.selected_asset = null;
				$('.asset_preview.selected').removeClass('selected');
			}
			this.listeners.onAssetSelected(null);
			if(this.is_view_open)
				this.closeView();
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
		this.player_health = health;
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
		let healed = this.player_health < health;
		this.setHealth(health);
		let damage_effect = $.create('div').setClass('damage-effect');
		if(health <= 0)
			damage_effect.addClass('killed');
		else if(healed)
			damage_effect.addClass('healed');
		this.container.addChild(damage_effect);
		setTimeout(() => {
			damage_effect.delete();
		}, 5000);
	}

	/** @param {PowerUpBase} powerup */
	onPlayerCollectedPowerup(powerup) {
		let powerup_info = $.create('div').addChild(
			$.create('div').addClass(powerup.type),
			$.create('div').text( OBJECTS[powerup.type].name ),
			$.create('div').addClass('fade-timer').setStyle({
				'animation-duration': `${powerup.duration_time}ms`
			})
		);
		this.active_powerups.addChild( powerup_info );

		setTimeout(() => powerup_info.delete(), powerup.duration_time);
	}

	/**
	 * @param {string} name
	 */
	async setMapName(name) {
		//this.map_name_holder = name;
		this.map_name.text(name);
		if(MapRecords.getRecord(name) !== null) {
			this.local_best_time.text("Najlepszy czas lokalnie: " + (Common.milisToTime(MapRecords.getRecord(name), ' ', {
				seconds: ' sek',
				minutes: ' min',
				hours: ' godz'
			})));
			this.local_best_time.setStyle({display: 'block'});
		}

		if(!(await ServerApi.pingServer())) return;
		try {
			let data = await ServerApi.getRanking();
			let map_records = data.find(d => d.map_name === name).records;
			if(map_records !== null) {
				this.server_best_time.text("Najlepszy czas globalnie: " + (Common.milisToTime(map_records[0].time, ' ', {
					seconds: ' sek',
					minutes: ' min',
					hours: ' godz'
				})));
				this.server_best_time.setStyle({display: 'block'});
			}
		} catch (e) {
			console.error(e);
		}
	}

	/** 
	 * @param {number} time elapsed game time in miliseconds
	 */
	setTimer(time) {
		let t = Common.milisToTime(time|0, ':');
		if(this.elapsed_time.innerText !== t)
			this.elapsed_time.text(t);
	}

	showAssetsList(category = CATEGORIES.all) {
		let container = $.create('div').addClass('assets_container').on('click', e => {
			if(e.target === container && typeof this.listeners.onAssetSelected === 'function') {
				if(this.selected_asset !== null) {
					this.selected_asset = null;
					$('.asset_preview').removeClass('selected');
					this.listeners.onAssetSelected(null);
				}
			}
		});

		this.asset_categories.getChildren().forEach(ch => {
			ch.setClass(category === ch.innerText ? 'selected' : '')
		});

		const preview_size = 70;

		for(let [obj_name, obj] of Object.entries(OBJECTS)) {
			if(!obj.categories.includes(category))
				continue;
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
					})
				);
			}
			else
				asset_preview.addClass('single_option');

			if(obj.class_name.indexOf('enemy') === -1) {
				asset_preview.addChild(
					$.create('button').text('STATYCZNY').on('click', (e) => {
						this.selectAsset(obj, obj_name, false);
						e.stopPropagation();
					})
				);
			}
			else
				asset_preview.addClass('single_option');

			asset_preview.addChild( $.create('label').addClass('name-label').text(obj.name) );

			container.addChild(asset_preview);
		}

		this.main_edit.text('').addChild( container );
	}

	showObjectEditOptions() {
		let container = editObjectOptions(this.selected_object, () => {
			if(this.mode === 1 && typeof this.listeners.deleteObject === 'function') {
				this.listeners.deleteObject(this.selected_object);
				this.selectObject(null);
			}
		}, () => {
			if(this.mode === 1) {
				let classname = this.selected_object.getClassName().split(' ')[0];
				this.listeners.onAssetSelected(this.selected_object);
				this.selectObject(null);
			}
		}, (new_transform) => {
			if(typeof this.listeners.updateObjectTransform === 'function' && this.mode === 1)
				this.listeners.updateObjectTransform(this.selected_object, new_transform);
		}, (keyframes, key_object) => {
			if(typeof this.listeners.updateObjectKeyframes === 'function' && this.mode === 1)
				this.listeners.updateObjectKeyframes(key_object, keyframes);
		});

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
		this.selected_asset.dynamic = obj.dynamic = dynamic;
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
		if(this.download_export_confirm === null && force !== true) {
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

		if(typeof this.listeners.freezeControls === 'function')
			this.listeners.freezeControls(false);
	}

	showSettings() {
		if(!this.gui_center)
			return;

		SettingsView.open(this.gui_center, this.closeView.bind(this));

		this.is_view_open = true;
		this.container.addClass('view-open');

		if(typeof this.listeners.freezeControls === 'function')
			this.listeners.freezeControls(true);
	}

	/**
	 * @param  	{string} name name of completed map
	 * @param  	{number} time elapsed time in miliseconds
	 * @param  	{boolean} edited
	 * @param 	{any} map_data
	 */
	onMapFinished(name, time, edited, map_data) {
		this.closeView();
		
		ResultView.open(this, this.container, name, time, edited, map_data, this.closeView.bind(this));
	}
}
