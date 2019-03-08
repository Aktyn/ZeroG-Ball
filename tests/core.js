import colors from 'colors';

const RESULT_CODE = {
	PASSED: 	0,
	FAIL: 		1,
	EXCEPTION: 	2
}

class Test {
	constructor(_name) {
		this.name = _name;
		this.results = [];//{code: @RESULT_CODE, msg: @string}
	}

	_push_result(_code, _msg) {
		this.results.push({
			code: _code,
			msg: _msg
		});
	}

	_catch_exception(func_with_test) {
		try {
			func_with_test();
			return false;//no exception occured
		}
		catch(e) {
			return e.message;
		}
	}
}

class FunctionTest extends Test {
	constructor(_name, _func) {
		super(_name);
		this.func = _func;

		this.expect_args = [];
	}

	expect(...args) {
		this.expect_args = args;
		return this;//let it chain
	}

	to_return(value) {
		let result_msg = `${this.func.name}(${this.expect_args.join(', ')})`;

		let err_msg = super._catch_exception(() => {
			let result = this.func(...this.expect_args) === value;
			super._push_result(result === true ? RESULT_CODE.PASSED : RESULT_CODE.FAIL, result_msg);
		});
		if(err_msg) {
			super._push_result(RESULT_CODE.EXCEPTION, result_msg + ` throws exception: ${err_msg}`);
		}
		return this;//let it chain
	}
}

export const test = {
	func: function(name, target) {
		if(typeof target !== 'function')
			throw new Error('Argument must be a function');
		let f_test =  new FunctionTest(name, target);

		return f_test;
	}
}

export function describe(...tests) {
	let total = {passed: 0, failed: 0, exceptions: 0};

	for(let t of tests) {
		console.log(`${t.name}:`.bold);
		let stats = {passed: 0, failed: 0, exceptions: 0};
		for(let res of t.results) {
			switch(res.code) {
				case RESULT_CODE.PASSED:
					stats.passed++;
					total.passed++;
					console.log((' ✓ ' + res.msg).green.bold);
					break;
				case RESULT_CODE.FAIL:
					stats.failed++;
					total.failed++;
					console.log((' ✗ ' + res.msg).red.bold);
					break;
				case RESULT_CODE.EXCEPTION:
					stats.exceptions++;
					total.exceptions++;
					console.log((' ✗ ' + res.msg).red.bold);
					break;
			}
		}
		if(stats.failed === 0 && stats.exceptions === 0)
			console.log(`Fuly passed`.green.bold);
		else {
			console.log( 
				`${stats.passed} passed,`.green.bold,
				`${stats.failed} failed,`.red.bold,
				`${stats.exceptions} exceptions`.red.bold);
		}
	}

	console.log('\nTotal:'.bold,
		`${total.passed} passed,`.green.bold,
		`${total.failed} failed,`.red.bold,
		`${total.exceptions} exceptions`.red.bold);
}