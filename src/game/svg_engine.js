// @ts-check
import SvgObject from './svg';
import Config from './config';
<<<<<<< HEAD
<<<<<<< HEAD
=======
import Settings from './settings';
>>>>>>> stage3
=======
import Settings from './settings';
>>>>>>> origin/stage3
import './../styles/svg.scss';

export default class SvgEngine {
	constructor() {
<<<<<<< HEAD
<<<<<<< HEAD
		this.width = Config.ASPECT*Config.VIRT_SCALE;
		this.height = Config.VIRT_SCALE;//Math.round(1024/aspect);

		/*this.camera = {
			x: 0,
			y: 0,
			zoom: 1//works as scaling
		}*/

=======
=======
>>>>>>> origin/stage3
		this.width = Config.VIRT_SCALE * Number(Settings.getValue('aspect_ratio')); //*Config.ASPECT
		this.height = Config.VIRT_SCALE;//Math.round(1024/aspect);

		/** @type {SvgObject[]} */
<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3
		this.objects = [];

		this.svg = new SvgObject('svg', true).set({
			'width': this.width.toString(),
			'height': this.height,
			'class': 'game-svg',
			'viewBox': `${-this.width/2}, ${-this.height/2}, ${this.width}, ${this.height}`
		});

		this.defs = new SvgObject('defs', true);
<<<<<<< HEAD
<<<<<<< HEAD
		this.background_layer = new SvgObject('g');
		this.foreground_layer = new SvgObject('g');

		this.svg.addChild(this.defs);
		this.svg.addChild(this.background_layer);
		this.svg.addChild(this.foreground_layer);
=======
=======
>>>>>>> origin/stage3
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
<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3
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
<<<<<<< HEAD
<<<<<<< HEAD
				'x': 0, 'y': 0,
				'width': width, 'height': height,
=======
=======
>>>>>>> origin/stage3
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
<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3
				'href': source
			})
		);

		this.defs.addChild(texture);
	}

<<<<<<< HEAD
<<<<<<< HEAD
	update() {
		for(let obj of this.objects)
			obj.update();
	}
=======
=======
	/** @param {string} id */
	hasTexture(id) {
		return this.defs.node.querySelector('#' + id) !== null;
	}

>>>>>>> origin/stage3
	/*** @param {number} dt */
	/*update(dt) {
		for(let obj of this.objects)
			obj.update(dt);
	}*/
<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3

	/**
	* @param {{x: number, y: number, zoom: number}} opts
	*/
	updateView(opts) {
		this.svg.set({
			'viewBox': `${
<<<<<<< HEAD
<<<<<<< HEAD
				(-this.width/2 + this.height * (opts.x/opts.zoom) / 2)*opts.zoom
			}, ${
				(this.height * (opts.y/opts.zoom-1) / 2)*opts.zoom
			}, ${
				this.width * opts.zoom
			}, ${
				this.height * opts.zoom
=======
=======
>>>>>>> origin/stage3
				((-this.width/2 + this.height * (opts.x/opts.zoom) / 2)*opts.zoom).toFixed(2)
			}, ${
				((this.height * (opts.y/opts.zoom-1) / 2)*opts.zoom).toFixed(2)
			}, ${
				(this.width * opts.zoom).toFixed(2)
			}, ${
				(this.height * opts.zoom).toFixed(2)
<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3
			}`
		});
	}

<<<<<<< HEAD
<<<<<<< HEAD
	onResize(width, height) {
		this.svg.node.style.transformOrigin = '0 0';
		this.svg.node.style.transform = `scale(${height/Config.VIRT_SCALE})`;
	}

	addBackgroundObjects(...objs) {
		for(let obj of objs) {
			//this.objects.push(obj);//assuming that the background objects doesn't need update
			this.background_layer.addChild(obj);
		}
	}

	addObjects(...objs) {
		for(let obj of objs) {
			this.objects.push(obj);
			this.foreground_layer.addChild(obj);
		}
	}

=======
=======
>>>>>>> origin/stage3
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

<<<<<<< HEAD
>>>>>>> stage3
=======
>>>>>>> origin/stage3
	addClass(name) {
		//this.svg.node.setAttributeNS(null, 'class', name);
		this.svg.node.classList.add(name);
		return this;
	}

	getNode() {
		return this.svg.node;
	}
}