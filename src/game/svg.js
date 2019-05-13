<<<<<<< HEAD
// @ts-check
import Config from './config';

=======
//@ts-check
import Config from './config';

/**
 * @param  {{x: number, y: number, w: number, h: number, rot: number}} t1
 * @param  {{x: number, y: number, w: number, h: number, rot: number}} t2
 * @return {boolean}
 */
function transformEquals(t1, t2) {
	return t1.x === t2.x && t1.y === t2.y && t1.w === t2.w && t1.h === t2.h && t1.rot === t2.rot;
}

>>>>>>> stage3
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
<<<<<<< HEAD
=======
		this.prev_transform = JSON.parse(JSON.stringify(this.transform));
>>>>>>> stage3
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

<<<<<<< HEAD
	update(scale_in_transform = false) {//updates object transform
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
=======
	destroy() {
		this.node.remove();
	}

	_preserveTransform() {
		this.prev_transform.x 	= this.transform.x;
		this.prev_transform.y 	= this.transform.y;
		this.prev_transform.w 	= this.transform.w;
		this.prev_transform.h 	= this.transform.h;
		this.prev_transform.rot	= this.transform.rot;
	}

	/** @param {number} dt */
	update(dt, scale_in_transform = false) {//updates object transform
		if(transformEquals(this.transform, this.prev_transform))
			return;
		this._preserveTransform();

		if(!scale_in_transform && this.scale_changed === true) {
			if(this.name === 'circle')
				this.node.setAttributeNS(null, 'r', Config.VIRT_SCALE/2 * this.transform.w);
			else {
				
				this.node.setAttributeNS(null, 'width', Config.VIRT_SCALE * this.transform.w);
				this.node.setAttributeNS(null, 'height', Config.VIRT_SCALE * this.transform.h);
				
				this.node.setAttributeNS(null, 'x', -Config.VIRT_SCALE/2 * this.transform.w);
>>>>>>> stage3
				this.node.setAttributeNS(null, 'y', -Config.VIRT_SCALE/2 * this.transform.h);
			}

			this.scale_changed = false;
		}

<<<<<<< HEAD
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

	addChild(child) {
		if(child instanceof SvgObject)
			this.node.appendChild(child.node);
		else if(child instanceof Node)
			this.node.appendChild(child);
		else
			throw new Error('Incorrect child');
		return this;
	}

=======
		this.node.setAttributeNS(null, 'transform', `translate(${
			this.transform.x*Config.VIRT_SCALE/2} ${
			this.transform.y*Config.VIRT_SCALE/2}) rotate(${this.transform.rot/Math.PI*180}) ${
				scale_in_transform ? `scale(${this.transform.w}, ${this.transform.h})` : ''
			}`);
	}

	/** @param {SvgObject | Node} child */
	addChild(child, push_below = false) {
		let node = (child instanceof SvgObject) ? child.node : child;
		if(!(node instanceof Node))
			throw new Error('Incorrect child');
		
		if(push_below)
			this.node.insertAdjacentElement('afterbegin', node);
		else
			this.node.appendChild(node);
		return this;
	}

	/**
	* @param {string} name
	*/
>>>>>>> stage3
	setClass(name) {
		this.node.setAttributeNS(null, 'class', name);
		return this;
	}

<<<<<<< HEAD
=======
	/**
	* @param {string} name
	*/
>>>>>>> stage3
	addClass(name) {
		this.node.classList.add(name);
		return this;
	}

<<<<<<< HEAD
	setPos(x, y) {
		this.transform.x = x;
		this.transform.y = y;

		return this;
	}

	setSize(width, height) {
		this.transform.w = width;
		this.transform.h = typeof height === 'number' ? height : width;
=======
	/** 
	*	@param {string} name 
	*	@returns {boolean}
	*/
	hasClass(name) {
		return this.node.classList.contains(name);
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
		this.transform.h = height;//typeof height === 'number' ? height : width;
>>>>>>> stage3
		this.scale_changed = true;

		return this;
	}

<<<<<<< HEAD
	setRot(rot) {
		this.transform.rot = rot;
=======
	/**
	* @param {number} rot
	*/
	setRot(rot) {
		this.transform.rot = rot;
		while(this.transform.rot >= Math.PI*2) this.transform.rot -= Math.PI*2;
		while(this.transform.rot < 0) this.transform.rot += Math.PI*2;
>>>>>>> stage3

		return this;
	}

	set(attributes) {//@atributes object like: {fill: 'red', ...}
		for(let attrib in attributes)
			this.node.setAttributeNS(null, attrib, attributes[attrib]);
		return this;
	}
}