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
	for(let t of tests) {
		console.log(`${t.name}`.bold);
		for(let res of t.results) {
			switch(res.code) {
				case RESULT_CODE.PASSED:
					console.log((' ✓ ' + res.msg).green.bold);
					break;
				case RESULT_CODE.FAIL:
					console.log((' ✗ ' + res.msg).red.bold);
					break;
				case RESULT_CODE.EXCEPTION:
					console.log((' ✗ ' + res.msg).red.bold);
					break;
			}
		}
		//TODO - count passed/failed/total
	}
}