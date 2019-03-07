export default {
	test_func: function(a, b) {
		if(a === 0 && b === 0)
			throw new Error('Test exception message');
		return a+b;
	}
};