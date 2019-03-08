import './styles/main.css';

import * as other from './other_file';

function sqrt(x) {
	if(x < 0)
		throw new Error('Cannot compute square root from negaitve number');
	return Math.sqrt(x);
}

console.log(other.default.test_func(6, 3));
// module.exports = sqrt;