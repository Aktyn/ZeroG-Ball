require('babel-register')({
	presets: [
		'env',
	],
	cache: false
});

module.exports = require('./common_tests.js');