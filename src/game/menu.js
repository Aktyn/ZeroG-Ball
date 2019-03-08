export default class Menu {
	constructor(target) {
		
		this.container = document.createElement('div');
		this.container.className = 'menu-container';
		this.container.innerText = 'TODO - menu';

		target.appendChild(this.container);
	}
}