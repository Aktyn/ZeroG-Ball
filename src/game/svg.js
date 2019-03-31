// @ts-check
import Config from './config';

export default class SvgObject {
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
		this.scale_changed = false;

		if(!prevent_centering) {
			//place object in center of the svg
			if(this.name === 'circle') {
				this.node.setAttributeNS(null, 'r', String(Config.VIRT_SCALE/2));
				this.node.setAttributeNS(null, 'cx', '0');
				this.node.setAttributeNS(null, 'cy', '0');
			}
			else {
				this.node.setAttributeNS(null, 'width', String(Config.VIRT_SCALE));
				this.node.setAttributeNS(null, 'height', String(Config.VIRT_SCALE));
				this.node.setAttributeNS(null, 'x', String(-Config.VIRT_SCALE/2));
				this.node.setAttributeNS(null, 'y', String(-Config.VIRT_SCALE/2));
			}

			this.node.setAttributeNS(null, 'transform-origin', '0 0');
		}
	}

	destroy() {
		this.node.remove();
	}

	/*getNode() {
		return this.node;
	}*/

	/** @param {number} dt */
	update(dt, scale_in_transform = false) {//updates object transform
		if(!scale_in_transform && this.scale_changed === true) {
			if(this.name === 'circle') {
				//@ts-ignore
				this.node.setAttributeNS(null, 'r', Config.VIRT_SCALE/2 * this.transform.w);
				//this.node.setAttributeNS(null, 'cx', this.transform.x*Config.VIRT_SCALE/2);
				//this.node.setAttributeNS(null, 'cy', this.transform.y*Config.VIRT_SCALE/2);
			}
			else {
				//@ts-ignore
				this.node.setAttributeNS(null, 'width', Config.VIRT_SCALE * this.transform.w);
				//@ts-ignore
				this.node.setAttributeNS(null, 'height', Config.VIRT_SCALE * this.transform.h);
				//this.node.setAttributeNS(null, 'x', -Config.VIRT_SCALE/2 * this.transform.w +
				//	this.transform.x*Config.VIRT_SCALE/2);
				//this.node.setAttributeNS(null, 'y', -Config.VIRT_SCALE/2 * this.transform.h +
				//	this.transform.y*Config.VIRT_SCALE/2);
				//@ts-ignore
				this.node.setAttributeNS(null, 'x', -Config.VIRT_SCALE/2 * this.transform.w);
				//@ts-ignore
				this.node.setAttributeNS(null, 'y', -Config.VIRT_SCALE/2 * this.transform.h);
			}

			this.scale_changed = false;
		}

		//if(this.transform.rot !== 0) {
			//this.node.setAttributeNS(null, 'transform-origin', `${
			//	this.transform.x*Config.VIRT_SCALE/2} ${this.transform.y*Config.VIRT_SCALE/2}`);
			this.node.setAttributeNS(null, 'transform', `translate(${
				this.transform.x*Config.VIRT_SCALE/2} ${
				this.transform.y*Config.VIRT_SCALE/2}) rotate(${this.transform.rot/Math.PI*180}) ${
					scale_in_transform ? `scale(${this.transform.w}, ${this.transform.h})` : ''
				}`);
		//}
	}

	/** @param {SvgObject | Node} child */
	addChild(child) {
		if(child instanceof SvgObject)
			this.node.appendChild(child.node);
		else if(child instanceof Node)
			this.node.appendChild(child);
		else
			throw new Error('Incorrect child');
		return this;
	}

	/**
	* @param {string} name
	*/
	setClass(name) {
		this.node.setAttributeNS(null, 'class', name);
		return this;
	}

	/**
	* @param {string} name
	*/
	addClass(name) {
		this.node.classList.add(name);
		return this;
	}

	/**
	* @param {string} name
	*/
	removeClass(name) {
		this.node.classList.remove(name);
		return this;
	}

	/**
	* @param {number} x
	* @param {number} y
	*/
	setPos(x, y) {
		this.transform.x = x;
		this.transform.y = y;
		return this;
	}

	getTransform() {
		return this.transform;
	}

	/**
	* @param {number} width
	* @param {number} height
	*/
	setSize(width, height) {
		this.transform.w = width;
		this.transform.h = typeof height === 'number' ? height : width;
		this.scale_changed = true;

		return this;
	}

	/**
	* @param {number} rot
	*/
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