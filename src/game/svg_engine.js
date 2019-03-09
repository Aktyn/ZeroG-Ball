import {SvgObject} from './svg';
import Config from './config';

export default class SvgEngine {
	constructor() {
		this.width = Config.ASPECT*Config.VIRT_SCALE;
		this.height = Config.VIRT_SCALE;//Math.round(1024/aspect);

		this.svg = new SvgObject('svg', true).set({
			'width': this.width.toString(),
			'height': this.height,
			'class': 'game-svg',
			'viewbox': `0, 0, ${this.width}, ${this.height}`
		});
	}

	static createObject(name) {
		return new SvgObject(name);
	}

	onResize(width, height) {
		this.svg.node.style.transformOrigin = '0% 0%';
		this.svg.node.style.transform = `scale(${height/Config.VIRT_SCALE})`;
	}

	addObject(obj) {
		this.svg.addChild(obj);
	}

	getNode() {
		return this.svg.node;
	}
}