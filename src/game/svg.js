import Config from './config';

export class SvgObject {
	constructor(name, prevent_centering = false) {
		this.name = name;
		this.node = document.createElementNS("http://www.w3.org/2000/svg", name);

		this.x = 0;
		this.y = 0;
		this.width = 1;
		this.height = 1;

		if(!prevent_centering) {
			//this.setPos(0, 0);
			//this.setSize(0.5, 0.5);
			if(this.name === 'circle') {
				this.node.setAttributeNS(null, 'r', `${50/Math.pow(Config.ASPECT, 2/3)}%`);
				this.node.setAttributeNS(null, 'cx', `${50}%`);
				this.node.setAttributeNS(null, 'cy', `${50}%`);
			}
			else {
				this.node.setAttributeNS(null, 'width', `${this.width*Config.VIRT_SCALE}`);
				this.node.setAttributeNS(null, 'height', `${this.height*Config.VIRT_SCALE}`);
				this.node.setAttributeNS(null, 'x', 
					`${Config.VIRT_SCALE*(Config.ASPECT/2 - this.width/2 + this.x)}`);
				this.node.setAttributeNS(null, 'y', 
					`${Config.VIRT_SCALE*(0.5 - this.width/2 + this.y)}`);
				//TODO - remove x,y from position and use transform to move from the center
			}
		}
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
		this.x = x;
		this.y = y;

		//this.node.setAttributeNS(null, 'x', `${(0.5+x-this.width/2)*100}%`);
		//this.node.setAttributeNS(null, 'y', `${y*100}%`);
	}

	setSize(width, height) {
		this.width = width;
		this.height = height;

		this.node.setAttributeNS(null, 'width', `${width/Config.ASPECT*100}%`);
		this.node.setAttributeNS(null, 'height', `${height*100}%`);

		return this;
	}

	setSize2(width, height) {
		this.width = width;
		this.height = height;

		this.node.setAttributeNS(null, 'width', `${width}`);
		this.node.setAttributeNS(null, 'height', `${height}`);

		return this;
	}

	set(attributes) {//@atributes object like: {fill: 'red', ...}
		/*if(typeof style === 'string')
			this.node.style = style;
		else
			Object.assign(this.node.style, style);*/
		for(let attrib in attributes)
			this.node.setAttributeNS(null, attrib, attributes[attrib]);
		return this;
	}
}