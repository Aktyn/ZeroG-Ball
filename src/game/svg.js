import Config from './config';

export class SvgObject {
	constructor(name, prevent_centering = false) {
		this.name = name;
		this.node = document.createElementNS("http://www.w3.org/2000/svg", name);

		this.transform = {
			x: 0,
			y: 0,
			w: 1,
			h: 1,
			rot: 0
		};

		if(!prevent_centering) {
			//place object in center of the svg
			if(this.name === 'circle') {
				this.node.setAttributeNS(null, 'r', Config.VIRT_SCALE/2);
				this.node.setAttributeNS(null, 'cx', 0);
				this.node.setAttributeNS(null, 'cy', 0);
			}
			else {
				this.node.setAttributeNS(null, 'width', Config.VIRT_SCALE);
				this.node.setAttributeNS(null, 'height', Config.VIRT_SCALE);
				this.node.setAttributeNS(null, 'x', -Config.VIRT_SCALE/2);//Config.VIRT_SCALE*(Config.ASPECT - 1)/2
				this.node.setAttributeNS(null, 'y', -Config.VIRT_SCALE/2);
			}
		}

		this.node.setAttributeNS(null, 'transform-origin', '0 0');

		//this.node.setAttributeNS(null, 'transform-origin', 
		//	`${Config.VIRT_SCALE/2*Config.ASPECT} ${Config.VIRT_SCALE/2}`);
		//this.node.setAttributeNS(null, 'transform', 'translate(500, -200) scale(0.2) rotate(45)');
	}

	update() {//updates object transform
		this.node.setAttributeNS(null, 'transform', 
			`translate(${this.transform.x*Config.VIRT_SCALE}, ${this.transform.y*Config.VIRT_SCALE}) 
			rotate(${this.transform.rot/Math.PI*180}) 
			scale(${this.transform.w} ${this.transform.h})`);
	}

	addChild(child) {
		if(child instanceof SvgObject)
			this.node.appendChild(child.node);
		else if(child instanceof Node)
			this.node.appendChild(child);
		else
			throw new Error('Incorrect child');
	}

	/*setClass(name) {
		this.node.className = name;
		return this;
	}*/

	setPos(x, y) {
		this.transform.x = x;
		this.transform.y = y;

		return this;
	}

	setSize(width, height) {
		this.transform.w = width;
		this.transform.h = typeof height === 'number' ? height : width;

		return this;
	}

	setRot(rot) {
		this.transform.rot = rot;

		return this;
	}

	set(attributes) {//@atributes object like: {fill: 'red', ...}
		for(let attrib in attributes)
			this.node.setAttributeNS(null, attrib, attributes[attrib]);
		return this;
	}
}