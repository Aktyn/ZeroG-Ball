import $ from './../utils/html';

export default class GameGUI {
	constructor(listeners = {}) {
		this.listeners = listeners;
		this.menu_return_confirm = null;

		this.is_view_open = false;

		this.container = $.create('div').addClass('game-gui-container').addChild(
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
					$.create('button').text('IMPORT')//TODO
				).addChild(
					$.create('button').text('EXPORT')//TODO
				).addChild(
					$.create('button').text('WYCZYŚĆ MAPĘ')//TODO
				).addChild(
					$.create('button').text('RESTART')//TODO
				)
			).addChild(
				this.modes_panel = $.create('div').addClass('modes')
			).addChild(
				$.create('div').addClass('actions').addChild(
					$.create('button').text('USTAWIENIA')
						.on('click', this.showSettings.bind(this))
				).addChild(
					this.menu_return_btn = $.create('button').addClass('exit-btn')
						.text('WYJŚCIE DO MENU').on('click', this.tryReturnToMenu.bind(this))
				)
			)
		).addChild(
			this.gui_center = $.create('div').addClass('gui-center').on('click', e => {
				if(e.target === this.gui_center && this.is_view_open)
					this.closeView();
			})
		);

		['GRA', 'EDYCJA'].forEach((mode, i) => {
			let btn = $.create('button').text(mode).setAttrib('id', i).on('click', btn => {
				//console.log(btn.target.id);
				this.modes_panel.getChildren().forEach(ex_btn => {
					ex_btn.disabled = ex_btn.id === btn.target.id;
				});
				this.changeMode(btn.target.id);
			});
			if(i === 0)//first element
				btn.disabled = true;//btn.setAttrib('disabled', undefined);
			this.modes_panel.addChild(btn);
		});

		//this.showSettings();//temp test
	}

	getNode() {
		return this.container;
	}

	changeMode(id) {
		console.log('TODO', id);
	}

	tryReturnToMenu() {
		if(this.menu_return_confirm === null) {
			this.menu_return_btn.text('Na pewno?');
			this.menu_return_confirm = setTimeout(() => {
				this.menu_return_btn.text('Powrót do menu');
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
		this.is_view_open = false;
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
				$.create('article').text('TODO')
			)
		);

		this.is_view_open = true;
	}
}