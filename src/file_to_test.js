/**
 * Returns the sum of a and b
 * @param {number} a
 * @param {number} b
 * @returns {number} Sum of a and b if a and b are not equal to 0 
 */
export default {
	test_func: function(a, b) {
		if(a === 0 && b === 0)
			throw new Error('Test exception message');
		return a+b;
	}
};