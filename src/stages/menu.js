//@ts-check
import $ from './../utils/html';
import Common from './../utils/common';
import Stage from './stage';
import './../styles/menu.scss';
import {AVAILABLE_MAPS} from './../game/map_data';
import MapRecords from './../game/map_records';
import ServerApi from '../utils/server_api';

const ALL_UNLOCKED_TEXT = 'Gratulacje! Wszystkie poziomy zostały odblokowane!';
const UNLOCK_LEVELS_TEXT = 'Ukończ wszystkie dostępne poziomy aby odblokować kolejne';

const BACKGROUND_CHANGE_FREQUENCY = 30000;//miliseconds

let bg_textures = [
	require('../img/wallpapers/introduction.jpg'),
	require('../img/wallpapers/vulcano.jpg'),
	require('../img/wallpapers/first_encounter.jpg'),
	require('../img/wallpapers/iceage.jpg'),
];

function getEloRanking(data) {
	/** @type {Map<string, number>} */
	let elo_players = new Map();
	for(let map_results of data) {
		if( !AVAILABLE_MAPS.find(m => m.name === map_results.map_name) ) {
			console.log('Skipping non existing map:', map_results.map_name);
			continue;
		}
		//make sure it is sorted by sorting it
		/** @type {{nickname: string, time: number}[]} */
		let records = map_results.records.sort((a, b) => a.time - b.time);
		for(let pi=0; pi < records.length; pi++) {
			let nick = records[pi].nickname;
			//1000 is initial elo rank
			let p_rank = elo_players.get(nick) || elo_players.set(nick, 1000).get(nick);
			let total_reward = 0;

			for(let ei=0; ei<records.length; ei++) {//enemy index
				if(pi === ei)
					continue;
				let e_nick = records[ei].nickname;
				//enemy rank
				let e_rank = elo_players.get(e_nick) || 
					elo_players.set(e_nick, 1000).get(e_nick);

				total_reward += Common.eloRating(p_rank, e_rank, pi < ei);
			}


			elo_players.set(nick, p_rank+total_reward);
		}
	}

	let result_array = [];
	for(let [nick, rank] of elo_players.entries()) 
		result_array.push({nick, rank});
	result_array.sort((a, b) => b.rank - a.rank);
	result_array.length = Math.min(20 * AVAILABLE_MAPS.length, result_array.length);
	//console.log(result_array);
	return result_array;
}

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
			$.create('div').setStyle({'color': '#B0BEC5'}).text(
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

		let maps_section = $.create('section').addClass('maps-section');
		
		// this.start_btn = $.create('button').text('START').on('click', listeners.onStart);
		/** @type {MapItem[]} */
		this.map_items = [];

		this.avaible_maps = $.create('section').setClass('avaible_maps_list');
		let all_maps_unlocked = this.loadAvaibleMaps();

		this.clear_progress_confirm = null;

		maps_section.addChild(
			$.create('h1').text('Dostępne poziomy'),
			this.avaible_maps,
			this.unlocked_info = $.create('div').text(
				all_maps_unlocked ? ALL_UNLOCKED_TEXT : UNLOCK_LEVELS_TEXT
			).setStyle({
				'color': '#B0BEC5'
			})
		);

		maps_section.addChild(
			$.create('hr'),//.setStyle({'background-color': '#546E7A'}),
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
			maps_section.addChild(
				$.create('hr'),//.setStyle({'background-color': '#546E7A'}),
				this.clear_progress_btn = $.create('button').text('WYCZYŚĆ POSTĘP').on('click', () => {
					this._tryClearProgress();
				})
			);
		}

		let random_bg = (Math.random() * bg_textures.length)|0;

		this.background_container = $.create('div').addClass('background-container').addChild(
			$.create('div'),
			$.create('div').setStyle({'background-image': `url(${bg_textures[random_bg]})`})
		);
		this.bg_index = random_bg;
		this.bg_timeout = setTimeout(this.nextBackground.bind(this), BACKGROUND_CHANGE_FREQUENCY);

		this.container.addChild(this.background_container, maps_section);//note order of children

		this.loadRanking();

		//secrets
		$(window).on('keydown', this.onKey.bind(this));
		this.secret_code = '';

		//disables menu
		//setTimeout(()=>this.listeners.onStart(AVAILABLE_MAPS[3]), 100);//TEMP
	}

	close() {
		if(this.bg_timeout)
			clearTimeout(this.bg_timeout);
		for(let item of this.map_items)
			item.destroy();
		super.close();
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

	nextBackground() {
		let layers = this.background_container.getChildren();
		
		layers[1].setStyle({'background-image': `url(${bg_textures[this.bg_index]})`});
		this.bg_index = (this.bg_index+1) % bg_textures.length;
		layers[0].setStyle({'background-image': `url(${bg_textures[this.bg_index]})`});
		layers[1].removeClass('fader');
		void layers[1].offsetWidth;//trick to restart fading animation
		layers[1].setClass('fader');
		
		this.bg_timeout = setTimeout(this.nextBackground.bind(this), BACKGROUND_CHANGE_FREQUENCY);
	}

	async loadRanking() {
		if( !(await ServerApi.pingServer()) )
			return;

		//load ranking data
		let data = await ServerApi.getRanking();
		let elo_ranking = getEloRanking(data);
		let empty = !data.some(d => d.records.length > 0);
		if(empty) {
			console.log('Stopping ranking from display due to empty records');
			return;
		}

		this.container.addClass('two-column');

		let map_selector = $.create('select');
		
		for(let a_map of AVAILABLE_MAPS) {
			let opt = $.create('option').setAttrib('value', a_map.name);
			opt.innerText = a_map.name;
			map_selector.addChild( opt );
		}

		let map_selector_container = $.create('nav').addChild(
			$.create('label').text('Mapa:'),
			map_selector,
		).setStyle({'margin-bottom': '10px'});

		let rankingTypeSwitcher = $.create('button').text('Pokaż ogólny ranking')
			.on('click', switchRankingType);

		let thead = $.create('thead');
		let tbody = $.create('tbody');

		this.container.addChild(
			$.create('div').addClass('ranking-container').addChild(
				$.create('h1').text('Najlepsze wyniki'),
				map_selector_container,
				rankingTypeSwitcher,
				$.create('hr'),
				$.create('div').addClass('table-container').addChild(
					$.create('table').addChild( thead, tbody )
				)
			)
		);

		let detailed_type = false;
		function switchRankingType() {
			detailed_type = !detailed_type;
			
			map_selector_container.setStyle({'display': detailed_type ? 'block' : 'none'});
			rankingTypeSwitcher.text(detailed_type ? 
				'Pokaż ogólny ranking' : 'Pokaż ranking względem map');

			
			if(detailed_type) {
				thead.text('').addChild($.create('tr').addChild(
					$.create('th').text('Nick'),
					$.create('th').text('Czas')
				));
				showMapRecords();
			}
			else {
				thead.text('').addChild($.create('tr').addChild(
					$.create('th').text('Nick'),
					$.create('th').text('Rank')//elo rank
				));
				tbody.text('');

				for(let player of elo_ranking) {
					tbody.addChild( $.create('tr').addChild(
						$.create('td').text(player.nick),
						$.create('td').text( Math.round(player.rank) )
					) );
				}
			}
		}

		function showMapRecords() {
			tbody.text('');

			try {
				let map_records = data.find(d => d.map_name === map_selector.value).records;
				if(map_records.length < 1)
					tbody.text('Brak wyników');
				for(let record of map_records) {
					tbody.addChild( $.create('tr').addChild(
						$.create('td').text(record.nickname),
						$.create('td').text( Common.milisToTime(record.time, ' ', {
							seconds: ' sek',
							minutes: ' min',
							hours: ' godz'
						}) )
					) );
				}
			}
			catch(e) {
				tbody.text('Brak wyników');
			}
		}

		map_selector.on('change', () => showMapRecords());
		map_selector.on('wheel', (e) => {
			let dt = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
			let map_i = AVAILABLE_MAPS.findIndex(m => m.name === map_selector.value);
			if(dt > 0)
				map_i--;
			else
				map_i++;
			if(map_i < 0)
				map_i = AVAILABLE_MAPS.length-1;
			else
				map_i %= AVAILABLE_MAPS.length;
			map_selector.value = AVAILABLE_MAPS[map_i].name;
			showMapRecords();
		});
		switchRankingType();
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
}
