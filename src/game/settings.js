//@ts-check

const DEFAULTS = {
	'shadows': false,
	'textures': true,
	'aspect_ratio': 1280/720,//value doesnt't matter if aspect_auto is true
	'aspect_auto': true
};

/** @type {{[index: string]: boolean | string | number}} stores key: value pairs */
let settings_store = {};

/** @type {{[index: string]: (value: boolean | string | number) => void}} [description] */
let watchers = {};

const SETTINGS = {
	/**
	 * Example: setValue('volume', 100)
	 * @param  {string} key   Name of the setting
	 * @param  {boolean | string | number | undefined} value
	 */
	setValue: (key, value) => {
		if(value === undefined)
			return SETTINGS.remove(key);

		settings_store[key] = value;

		localStorage.setItem(key, JSON.stringify({
			type: typeof value,
			value: value.toString()
		}));

		if(typeof watchers[key] === 'function')
			watchers[key](value);
	},

	/**
	 * @param  {string} key
	 * @returns {boolean | string | number | undefined}
	 */
	getValue: (key) => {
		if(settings_store[key] !== undefined)
			return settings_store[key];
		else if (localStorage.getItem(key) !== null) {
			/** @type {{type: string, value: string}} */
			let item = JSON.parse( localStorage.getItem(key) );
			switch(item.type) {
				case 'string': 	return (settings_store[key] = item.value);
				case 'boolean':	return (settings_store[key] = item.value === 'true');
				case 'number': 	return (settings_store[key] = Number(item.value));
			}
			throw new Error('Incorrect type: ' + item.type);
		}
		if(DEFAULTS[key] !== undefined)
			return DEFAULTS[key];
		throw new Error('Cannot retrieve setting value.');
	},

	/**
	 * @param  {string} key
	 */
	remove(key) {
		delete settings_store['key'];
		localStorage.removeItem(key);
	},

	/**
	 * Set all settings to default values
	 */
	reset() {
		for(let [key, value] of Object.entries(DEFAULTS))
			this.setValue(key, value);
	},

	/**
	 * Invokes callback function when setting value of given key is changed
	 * @param  {string} key
	 * @param {((value: boolean | string | number) => void) | undefined} callback
	 */
	watch(key, callback) {
		if(callback === undefined)
			delete watchers[key];
		else
			watchers[key] = callback;
	}
}

export default SETTINGS;
