//import './styles/main.css';

function sqrt(x) {
	if(x < 0)
		throw new Error('Cannot compute square root from negaitve number');
	return Math.sqrt(x);
}
module.exports = sqrt;

//console.log( add(6, 9).toString() );