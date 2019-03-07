const sqrt = require('./../src/main');

function test(name, func, args, expected) {
	try {
		if(func(...args) === expected)
			console.log(name, 'ok');
		else
			console.error(name, 'failed');
	}
	catch(e) {
		console.error(name, 'error:', e.message);
	}
}

test(
	'sqrt(25)=5',
	sqrt, [25], 5
);

test(
	'sqrt(25)=8',
	sqrt, [25], 8
);

test(
	'sqrt(25)=5',
	sqrt, [-2], 5
);