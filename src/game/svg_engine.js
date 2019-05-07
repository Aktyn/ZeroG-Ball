// @ts-check
import SvgObject from './svg';
import Config from './config';
import Settings from './settings';
import './../styles/svg.scss';

export default class SvgEngine {
	constructor() {
		this.width = Config.VIRT_SCALE * Number(Settings.getValue('aspect_ratio')); //*Config.ASPECT
		this.height = Config.VIRT_SCALE;//Math.round(1024/aspect);

		/** @type {SvgObject[]} */
		this.objects = [];

		this.svg = new SvgObject('svg', true).set({
			'width': this.width.toString(),
			'height': this.height,
			'class': 'game-svg',
			'viewBox': `${-this.width/2}, ${-this.height/2}, ${this.width}, ${this.height}`
		});

		this.defs = new SvgObject('defs', true);
		this.svg.addChild(this.defs);

		//this.background_layer = new SvgObject('g');
		//this.foreground_layer = new SvgObject('g');
		
		/** @type {SvgObject[]} */
		this.layers = new Array(3).fill(0).map(() => new SvgObject('g'));
		this.layers.forEach(layer => this.svg.addChild(layer));
		
		//this.svg.addChild(this.background_layer);
		//this.svg.addChild(this.foreground_layer);
	}

	/** @param {number} index */
	getLayer(index) {
		return this.layers[index];
	}

	/**
	 * @param  {number} _width  
	 * @param  {number} _height 
	 * @param  {number} aspect 
	 */
	onResize(_width, _height, aspect) {
		this.width = Config.VIRT_SCALE * aspect;
		this.svg.set({
			'width': this.width.toString(),
			'viewBox': `${-this.width/2}, ${-this.height/2}, ${this.width}, ${this.height}`
		});

		this.svg.node.style.transformOrigin = '0 0';
		this.svg.node.style.transform = `scale(${_height/Config.VIRT_SCALE})`;
	}

	/**
	 * @param {boolean} enabled
	 */
	enableTextures(enabled) {
		if(enabled && this.svg.hasClass('no-textures'))
			this.svg.removeClass('no-textures');
		if(!enabled && !this.svg.hasClass('no-textures'))
			this.svg.addClass('no-textures');
	}

	static createObject(name, prevent_centering = false) {
		return new SvgObject(name, prevent_centering);
	}

	//@effects - array of objects with name and attribs fields
	createFilter(id, ...effects) {
		let filter = new SvgObject('filter', true).set({
			'id': id,
			'x': '-10%', 'y': '-10%', 'width': '120%', 'height': '120%'
		});
		for(let effect of effects) {
			if(effect instanceof SvgObject)
				filter.addChild(effect);
			else
				filter.addChild( new SvgObject(effect.name, true).set(effect.attribs) );
		}
		this.defs.addChild(filter);
	}

	/**
	* @param {string} id
	* @param {string} source
	* @param {number} width
	* @param {number} height
	*/
	createTexture(id, source, width, height) {
		//<pattern id="img1" patternUnits="userSpaceOnUse" width="100" height="100">
		//	<image xlink:href="wall.jpg" x="0" y="0" width="100" height="100" />
		//</pattern>
		let texture = new SvgObject('pattern', true).set({
			'id': id,
			'patternUnits': 'userSpaceOnUse', 
			'width': width, 'height': height
		}).addChild(
			new SvgObject('image', true).set({
				'x': (width/2)|0, 'y': (height/2)|0,
				'width': width|0+1, 'height': height|0+1,
				'href': source
			})
		).addChild(
			new SvgObject('image', true).set({
				'x': (-width/2)|0, 'y': (height/2)|0,
				'width': width|0+1, 'height': height|0+1,
				'href': source
			})
		).addChild(
			new SvgObject('image', true).set({
				'x': (-width/2)|0, 'y': (-height/2)|0,
				'width': width|0+1, 'height': height|0+1,
				'href': source
			})
		).addChild(
			new SvgObject('image', true).set({
				'x': (width/2)|0, 'y': (-height/2)|0,
				'width': width|0+1, 'height': height|0+1,
				'href': source
			})
		);

		this.defs.addChild(texture);
	}

	/*** @param {number} dt */
	/*update(dt) {
		for(let obj of this.objects)
			obj.update(dt);
	}*/

	/**
	* @param {{x: number, y: number, zoom: number}} opts
	*/
	updateView(opts) {
		this.svg.set({
			'viewBox': `${
				((-this.width/2 + this.height * (opts.x/opts.zoom) / 2)*opts.zoom).toFixed(2)
			}, ${
				((this.height * (opts.y/opts.zoom-1) / 2)*opts.zoom).toFixed(2)
			}, ${
				(this.width * opts.zoom).toFixed(2)
			}, ${
				(this.height * opts.zoom).toFixed(2)
			}`
		});
	}

	addBackgroundObjects(...objs) {
		for(let obj of objs)
			this.layers[0].addChild(obj);
	}

	/** 
	 * @param {number} layer_index
	 * @param {...SvgObject} objs
	 */
	addObjects(layer_index, ...objs) {
		for(let obj of objs) {
			this.objects.push(obj);
			this.layers[layer_index].addChild(obj);
		}
	}

	/** 
	 * @param {number} layer_index
	 * @param {...SvgObject} objs
	 */
	addObjectsBelow(layer_index, ...objs) {
		for(let obj of objs) {
			this.objects.push(obj);
			this.layers[layer_index].addChild(obj, true);
		}
	}

	clearForeground() {//removes every child from foreground
		for(let obj of this.objects)
			obj.destroy();
		this.objects = [];
	}

	addClass(name) {
		//this.svg.node.setAttributeNS(null, 'class', name);
		this.svg.node.classList.add(name);
		return this;
	}

	getNode() {
		return this.svg.node;
	}
}