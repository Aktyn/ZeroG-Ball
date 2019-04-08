//@ts-check
import $ from './../utils/html';
import Stage from './stage';
import './../styles/menu.scss';
import {AVAIBLE_MAPS} from './../game/map_data';

const _void_func = ()=>{};

class MapItem {
	/**
	 * @param {{name: string, json: any}} data
	 * @param {(data: any) => void | undefined} listener
	 */
	constructor( data, listener) {
		this.data = data;
		this.listener = listener;
		this.widget = $.create('div').on('click', this.onClick.bind(this)).addChild(
			$.create('div').text(data.name).setStyle({'font-weight': 'bold'}),
			$.create('div').text('TODO - best time')
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
		super(target, 'menu-container', listeners)
		
		//this.start_btn = $.create('button').text('START').on('click', listeners.onStart);
		/** @type {MapItem[]} */
		this.map_items = [];

		this.avaible_maps = $.create('section').setClass('avaible_maps_list');
		for(let map of AVAIBLE_MAPS) {
			let item = new MapItem(map, this.listeners.onStart);
			this.map_items.push(item);
			this.avaible_maps.addChild( item.widget );
		}

		this.container.addChild(
			//this.start_btn, 
			$.create('h1').text('Dostępne mapy'),
			this.avaible_maps,
			//$.create('hr'),
			$.create('div').text('Ukończ wszystkie dostępne mapy aby odblokować kolejne').setStyle({
				'color': '#90A4AE'
			})
		);


		//secrets
		$(window).on('keydown', this.onKey.bind(this));
		this.secret_code = '';
	}

	/** @param {KeyboardEvent} e */
	onKey(e) {
		this.secret_code += e.key;
		if( !'odblokuj'.startsWith(this.secret_code) )
			this.secret_code = '';
		else if(this.secret_code === 'odblokuj')
			console.log('TODO');
	}

	close() {
		//if(this.start_btn)
		//	this.start_btn.off('click', this.listeners.onStart);
		for(let item of this.map_items)
			item.destroy();

		super.close();
	}
}