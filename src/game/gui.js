import $ from './../utils/html';

export default class GUI {
	constructor(listeners = {}) {
		this.listeners = listeners;
		this.menu_return_confirm = null;

		this.is_view_open = false;

		this.container = $.create('div').addClass('game-gui-container').addChild(
			$.create('header').addChild(
				$.create('div').addClass('actions').addChild(
					$.create('button').addClass('exit-btn').text('Ustawienia')
						.on('click', this.showSettings.bind(this))
				).addChild(
					this.menu_return_btn = $.create('button').addClass('exit-btn')
						.text('Powrót do menu').on('click', this.tryReturnToMenu.bind(this))
				)
			)
		).addChild(
			this.gui_center = $.create('div').addClass('gui-center').on('click', e => {
				if(e.target === this.gui_center && this.is_view_open)
					this.closeView();
			})
		);

		this.showSettings();//temp test
	}

	getNode() {
		return this.container;
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