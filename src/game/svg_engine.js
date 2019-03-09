import {SvgObject} from './svg';
import Config from './config';
import './../styles/svg.css';

export default class SvgEngine {
	constructor() {
		this.width = Config.ASPECT*Config.VIRT_SCALE;
		this.height = Config.VIRT_SCALE;//Math.round(1024/aspect);

		/*this.camera = {
			x: 0,
			y: 0,
			zoom: 1//works as scaling
		}*/

		this.objects = [];

		this.svg = new SvgObject('svg', true).set({
			'width': this.width.toString(),
			'height': this.height,
			'class': 'game-svg',
			'viewBox': `${-this.width/2}, ${-this.height/2}, ${this.width}, ${this.height}`
		});
	}

	static createObject(name) {
		return new SvgObject(name);
	}

	update() {
		for(let obj of this.objects)
			obj.update();
	}

	updateCamera(x, y, zoom) {
		this.svg.set({
			'viewBox': `${
				(-this.width/2 + this.height * (x/zoom) / 2)*zoom
			}, ${
				(this.height * (y/zoom-1) / 2)*zoom
			}, ${
				this.width * zoom
			}, ${
				this.height * zoom
			}`
		});
	}

	onResize(width, height) {
		this.svg.node.style.transformOrigin = '0 0';
		this.svg.node.style.transform = `scale(${height/Config.VIRT_SCALE})`;
	}

	addObjects(...objs) {
		for(let obj of objs) {
			this.objects.push(obj);
			this.svg.addChild(obj);
		}
	}

	getNode() {
		return this.svg.node;
	}
}