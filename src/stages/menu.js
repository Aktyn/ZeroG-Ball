//@ts-check
import $ from './../utils/html';
import Common from './../utils/common';
import Stage from './stage';
import './../styles/menu.scss';
import {AVAILABLE_MAPS} from './../game/map_data';
import MapRecords from './../game/map_records';

const ALL_UNLOCKED_TEXT = 'Gratulacje! Wszystkie poziomy zostały odblokowane!';
const UNLOCK_LEVELS_TEXT = 'Ukończ wszystkie dostępne poziomy aby odblokować kolejne';

class MapItem {
	/**
	 * @param {{name: string, json: any}} data
	 * @param {(data: any) => void | undefined} listener
	 */
	constructor(data, listener) {
		this.data = data;
		this.listener = listener;
		let record = MapRecords.getRecord(data.name);

		this.widget = $.create('div').on('click', this.onClick.bind(this)).addChild(
			$.create('div').text(data.name).setStyle({'font-weight': 'bold'}),
			$.create('div').setStyle({'color': '#90A4AE'}).text(
				record === null ? '---' :
				`Rekord: ${Common.milisToTime(record, ' ', {
					hours: ' godzin', 
					minutes: ' minut',
					seconds: ' sekund'
				})}`
			)
		);
	}

	onClick() {
		if(typeof this.listener === 'function')
			this.listener(this.data);
	}

	destroy() {
		this.widget.off('click', this.onClick.bind(this));
	}
}

export default class MenuStage extends Stage {
	constructor(target, listeners) {
		super(target, 'menu-container', listeners);
		
		// this.start_btn = $.create('button').text('START').on('click', listeners.onStart);
		/** @type {MapItem[]} */
		this.map_items = [];

		this.avaible_maps = $.create('section').setClass('avaible_maps_list');
		let all_maps_unlocked = this.loadAvaibleMaps();

		this.clear_progress_confirm = null;

		this.container.addChild(
			$.create('h1').text('Dostępne poziomy'),
			this.avaible_maps,
			this.unlocked_info = $.create('div').text(
				all_maps_unlocked ? ALL_UNLOCKED_TEXT : UNLOCK_LEVELS_TEXT
			).setStyle({
				'color': '#90A4AE'
			})
		);

		this.container.addChild(
			$.create('hr').setStyle({'background-color': '#546E7A'}),
			$.create('button').text('PUSTA MAPA').on('click', () => {
				this.listeners.onStart({
					name: 'Pusta mapa', 
					json: {
	                    "background": 0,
                    	"objects": []
	                }
				});
			})
		);

		if(MapRecords.getRecord(AVAILABLE_MAPS[0].name) !== null) {
			this.container.addChild(
				$.create('hr').setStyle({'background-color': '#546E7A'}),
				this.clear_progress_btn = $.create('button').text('WYCZYŚĆ POSTĘP').on('click', () => {
					this._tryClearProgress();
				})
			);
		}


		//secrets
		$(window).on('keydown', this.onKey.bind(this));
		this.secret_code = '';

		//disables menu
		setTimeout(()=>this.listeners.onStart(AVAILABLE_MAPS[0]), 100);//TEMP
	}

	loadAvaibleMaps() {//returns true when every map is unlocked
		this.avaible_maps.text('');
		for(let map of AVAILABLE_MAPS) {
			if(!MapRecords.isUnlocked(map.name))
				return false;
			let item = new MapItem(map, this.listeners.onStart);
			this.map_items.push(item);
			this.avaible_maps.addChild( item.widget );
		}
		return true;
	}

	/** @param {KeyboardEvent} e */
	onKey(e) {
		this.secret_code += e.key;
		if( !'odblokuj'.startsWith(this.secret_code) )
			this.secret_code = '';
		else if(this.secret_code === 'odblokuj')
			console.log('TODO');
	}

	_tryClearProgress() {
		if(!this.clear_progress_btn)
			return;
		if(this.clear_progress_confirm === null) {
			this.clear_progress_btn.text('NA PEWNO?');
			this.clear_progress_confirm = setTimeout(() => {
				this.clear_progress_btn.text('WYCZYŚĆ POSTĘP');
				this.clear_progress_confirm = null;
			}, 5000);
		}
		else {
			//clearing progress data
			MapRecords.clear();

			if(this.clear_progress_confirm) {
				clearTimeout(this.clear_progress_confirm);
				this.clear_progress_confirm = null;
			}
			this.clear_progress_btn.text('WYCZYSZCZONO').setAttrib('disabled', 'true').setStyle({
				'background-color': '#66BB6A',
				'color': '#fff'
			});
			this.clear_progress_btn = null;
			this.loadAvaibleMaps();
			this.unlocked_info.text(UNLOCK_LEVELS_TEXT);
		}
	}

	close() {
		//if(this.start_btn)
		//	this.start_btn.off('click', this.listeners.onStart);
		for(let item of this.map_items)
			item.destroy();

		super.close();
	}
}
