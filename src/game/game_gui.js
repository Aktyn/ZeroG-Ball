import $ from './../utils/html';
import {OBJECTS} from './predefined_assets';
import MapData from './map_data';

export default class GameGUI {
	constructor(listeners = {}) {
		this.listeners = listeners;
		this.menu_return_confirm = null;

		this.is_view_open = false;
		this.mode = 0;//0
		this.download_export_confirm = null;
		this.map_data = null;
		this.selected_asset = null;

		this.container = $.create('div').setClass('game-gui-container mode-0').addChild(
			this.header = $.create('header')/*.addClass('hidden')*/.addChild(
				$.create('button').addClass('menu-btn').on('click', () => {
					if(!this.header)
						return;
					if(this.header.classList.contains('hidden'))
						this.header.classList.remove('hidden');
					else
						this.header.classList.add('hidden');
				})
			).addChild(
				$.create('div').addClass('game-buttons').addChild(
					$.create('button').text('IMPORT').on('click', this.tryImport.bind(this))
				).addChild(
					this.map_export_btn =  $.create('button').text('EXPORT')
						.on('click', this.tryExport.bind(this))
				).addChild(
					$.create('button').addClass('restart-btn').text('RESTART').on('click', () => {
						if(this.mode === 0 && typeof this.listeners.onRestart === 'function')
							this.listeners.onRestart();
					})
				)
			).addChild(
				this.modes_panel = $.create('div').addClass('modes')
			).addChild(
				$.create('div').addClass('actions').addChild(
					$.create('button').text('USTAWIENIA')
						.on('click', this.showSettings.bind(this))
				).addChild(
					this.menu_return_btn = $.create('button').addClass('exit-btn')
						.text('POWRÓT DO MENU').on('click', this.tryReturnToMenu.bind(this))
				)
			)
		).addChild(//GUI CENTER
			this.gui_center = $.create('div').addClass('gui-center').on('click', e => {
				if(e.target === this.gui_center && this.is_view_open)
					this.closeView();
			})
		).addChild( //EDIT MENU
			$.create('div').addClass('edit-tools').addChild(
				this.main_edit = $.create('div').addClass('main')
			).addChild(
				$.create('div').addClass('tools').addChild(
					$.create('button').text('USUŃ WSZYSTKO').on('click', () => {
						//edit mode
						if(this.mode === 1 && typeof this.listeners.onClearMap === 'function')
							this.listeners.onClearMap();
					})
				).addChild(
					$.create('div').addChild(
						$.create('button').text('COFNIJ').on('click', () => {
							if(this.mode === 1 && typeof this.listeners.undo === 'function')
								this.listeners.undo();
						})
					)/*.addChild(
						$.create('button').text('PONÓW').on('click', () => {
							
						})
					)*/
				)
			)
		);

		['GRA', 'EDYCJA'].forEach((mode, i) => {
			let btn = $.create('button').text(mode).setAttrib('id', i).on('click', btn => {
				//console.log(btn.target.id);
				this.modes_panel.getChildren().forEach(ex_btn => {
					ex_btn.disabled = ex_btn.id === btn.target.id;
				});
				this.changeMode(btn.target.id);
			});
			if(i === this.mode)//first element
				btn.disabled = true;//btn.setAttrib('disabled', undefined);
			this.modes_panel.addChild(btn);
		});

		//this.showSettings();//temp test
		this.changeMode(1);//temp test
	}

	getNode() {
		return this.container;
	}

	changeMode(id) {
		if(this.mode === parseInt(id))
			return;
		// console.log('TODO', id);
		this.mode = parseInt(id);
		this.container.setClass(`game-gui-container mode-${id} ${this.is_view_open ? 'view-open' : ''}`);

		if(this.mode === 1) {//edit mode open
			this.showAssetsList();
		}

		//edit mode pauses game physics, play mode reloads map
		if(typeof this.listeners.onModeChange === 'function')
			this.listeners.onModeChange(this.mode);
	}

	showAssetsList() {
		let container = $.create('div').addClass('assets_container');

		const preview_size = 70;

		for(let [obj_name, obj] of Object.entries(OBJECTS)) {
			let obj_preview = $.create('div').addClass(obj.theme);

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
			container.appendChild(
				$.create('div').addClass('asset_preview').addClass(obj_name).setStyle({
					width: `${preview_size}px`,
					height: `${preview_size}px`,
				}).addChild( obj_preview ).on('click', () => {
					this.selectAsset(obj, obj_name);
				})
			);
		}

		this.main_edit.text('').appendChild( container );
	}

	selectAsset(obj, name) {
		this.selected_asset = obj;
		$('.asset_preview').removeClass('selected');
		$(`.asset_preview.${name}`).addClass('selected');

		//TODO - darken gui center to indicate drop area
		//unselect asset when clicked outside
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
						this.listeners.onImport(e.target.result || '{}');
				};
				reader.readAsText(file);
			}).click();
	}

	tryExport() {
		if(typeof this.listeners.exportMapData !== 'function')
			return;
		if(this.download_export_confirm === null) {
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

	tryReturnToMenu() {
		if(this.menu_return_confirm === null) {
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
		this.gui_center.text('').addChild(
			$.create('div').addClass('view-container').addChild(
				$.create('header').text('Ustawienia').addChild(
					$.create('button').addClass('close-btn').on('click', this.closeView.bind(this))
				)
			).addChild(
				$.create('article').addChild(
					$.create('input').setAttrib('type', 'checkbox').setAttrib('id', 'IDcienie')
						.addClass('switch-input')
				).addChild(
					$.create('label').setAttrib('for', 'IDcienie').addClass('switch-label')
						.addText('Cienie')
			))
		);

		this.is_view_open = true;
		this.container.addClass('view-open');
	}
}