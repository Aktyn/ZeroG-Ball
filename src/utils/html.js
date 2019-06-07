function assert(condition, message) {
    if(!condition)
        throw new Error(message || "Assertion failed");
}

//removes every char except letters and digit from strng
function justLettersAndDigits(str) {
	return str.replace(/[^(a-zA-Z0-9)]*/gi, '');
}

const static_methods = {//static methods
	assert: assert,

	expand: function(parent, child, override = false) {
		if(!override)
			return Object.assign(parent, child);
		//override
		Object.getOwnPropertyNames(child).forEach(function(prop) {
			parent[prop] = child[prop];
		});
		return parent;
	},
	
	load: function(callback) {
		if (typeof callback !== 'function')
			throw new Error('Argument must be a function');
		if(document.body) 
			callback();
		else {
			var load_listener = function() {
				callback();
				window.removeEventListener('load', load_listener, false);
			};
			window.addEventListener('load', load_listener, false);
		}
	},

	/** 
	*	@param {string} value 
	*	@returns {Node & typeof extender}
	*/
	create: function(value) {//creates DOM HTMLElement
		var new_element = document.createElement( justLettersAndDigits(value) );
		return static_methods.expand(new_element, extender);
	},
	getScreenSize: function() {
		return {
			width: window.innerWidth || document.documentElement.clientWidth || 
				document.body.clientWidth,
			height: window.innerHeight || document.documentElement.clientHeight || 
				document.body.clientHeight
		};
	}
}

const extender = {//extended methods of DOM HTMLElements
	html: function(content) {
		this.innerHTML = String(content);
		return this;
	},
	/** 
	*	@param {any} content 
	*	@returns {Node & extender}
	*/
	text: function(content) {
		this.innerText = String(content);
		return this;
	},
	/** 
	*	@param {any} content 
	*	@returns {Node & extender}
	*/
	addText: function(content) {//this method does not cause losing marker issues
		this.appendChild( document.createTextNode(String(content)) );
		return this;
	},
	/** 
	*	@param {string} class_name 
	*	@returns {Node & extender}
	*/
	addClass: function(class_name) {
		this.classList.add(class_name);
		return this;
	},
	/** 
	*	@param {string} class_name 
	*	@returns {Node & extender}
	*/
	removeClass: function(class_name) {
		this.classList.remove(class_name);
		return this;
	},
	/** 
	*	@param {string} class_name 
	*/
	hasClass: function(class_name) {
		return this.classList.contains(class_name);
	},
	/** 
	*	@param {string} class_name 
	*	@returns {Node & extender}
	*/
	setClass: function(class_name) {
		this.className = class_name;//overrides existing classes
		return this;
	},
	/** 
	*	@param {string} query 
	*/
	getChildren: function(query = '*') {
		return fromQuery(query, this);
	},
	addChild: function(...elements) {
		/*if(element && element.length) {
			for(var i=0; i<element.length; i++)
				this.append(element[i]);
			return this;
		}
		
		this.appendChild(element);*/
		for(let el of elements.filter(el => el instanceof Node))
			this.appendChild(el);
		return this;
	},
	delete: function() {
		this.remove();
	},
	setStyle: function(css) {//@css - object
		static_methods.expand(this.style, css, true);
		return this;
	},
	/** 
	*	@param {string} name 
	*	@param {any} value 
	*	@returns {Node & extender}
	*/
	setAttrib: function(name, value) {
		this.setAttribute(name, String(value));
		return this;
	},
	/** 
	*	@param {string} name 
	*	@returns {Node & extender}
	*/
	removeAttrib: function(name) {
		this.removeAttribute(name);
		return this;
	},
	/** 
	*	@param {string} name 
	*/
	getAttrib: function(name) {
		return this.getAttribute(name);
	},
	isHover: function() {
		return (this.parentNode.querySelector(':hover') === this);
	},
	getPos: function() {
		var rect = this.getBoundingClientRect();
		return {x: rect.left, y: rect.top};
	},
	getWidth: function() {
		var rect = this.getBoundingClientRect();
		return rect.right - rect.left;
	},
	getHeight: function() {
		try {
			var rect = this.getBoundingClientRect();
			return rect.bottom - rect.top;
		}
		catch(e) {
			console.trace(e);
			return 0;
		}
	},

	on: function(event, func) {
		if (typeof func !== 'function')
			throw new Error('Argument must be a function');
		try {
			if(this.addEventListener)// most non-IE browsers and IE9
			   this.addEventListener(event, func, false);
			else if(this.attachEvent)//Internet Explorer 5 or above
			  	this.attachEvent('on' + event, func);
		   	else
				throw new Error('no addEventListener support');
		}
		catch(e) {
			console.trace('Cannot add event listener');
		}
		return this;
	},
	off: function(event, func) {//removeEventListener
		try {
			if(this.removeEventListener)// most non-IE browsers and IE9
			   this.removeEventListener(event, func, false);
			else if(this.detachEvent)//Internet Explorer 5 or above
			  	this.detachEvent('on' + event, func);
			else
				throw new Error('no removeEventListener support');
		}
		catch(e) {
			console.trace('Cannot remove event listener');
		}
		return this;
	}
};

/** 
*	@param {string} query 
*	@param {Node & extender} parent
*	@returns {(Node & extender) | (Node & extender)[]}
*/
function fromQuery(query, parent) {
	var value = Array.from((parent || document).querySelectorAll(query || '*'))
		.map( _HTMLElement_ => static_methods.expand(_HTMLElement_, extender, true) );

	if(value.length === 1)//returning single found HTMLElement
		return value[0];
	
	return smartArrayExtend(value);
}


/** 
*	smart extending array object of extender methods
*	@param {string} class_name 
*	@returns {(Node & extender) | (Node & extender)[]}
*/
function smartArrayExtend(arr) {
	Object.getOwnPropertyNames(extender).forEach(function(method) {
		if(typeof extender[method] !== 'function' || arr.hasOwnProperty(method))
			return;
		var array_extender = {};//temporary object
		array_extender[method] = function() {
			var args = Array.from(arguments);
			var result = [];
			arr.forEach(function(extended_HTMLElement) {
				result.push( extended_HTMLElement[method].apply(extended_HTMLElement, args) );
			});
			return smartArrayExtend( Array.prototype.concat.apply([], result) );//unrap and extend
		};
		static_methods.expand(arr, array_extender);
	});
	return arr;
}

/**
 * Description
 * @param {string|Node|HTMLElement|Window} value
 * @returns {Node & extender}
 */
function _self(value) {
	if(value instanceof HTMLElement || value === window) {//DOM HTMLElement
		static_methods.expand(value, extender, true);
		return value;
	}
	else if(typeof value === 'string')
		return fromQuery(value);
	else
		throw new Error("Given argument type is incompatible (" + typeof value + ")");
}

/** @type {_self & static_methods} */
var self = _self;
static_methods.expand(self, static_methods);

export default self;
//return __self;
//})();