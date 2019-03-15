import {test, describe} from './core';

import test_file from './../src/file_to_test';

describe(
	test.func('Test name', test_file.test_func)
		.expect(5, 7).to_return(12)
		.expect(584, 16).to_return(600)
		.expect(2, 2).to_return(5)
		.expect(0, 0).to_return(69)

)