//@ts-check
/**
 * @param  {number} num number of seconds, minutes or hours
 */
function zeroPad(num) {
	return num < 10 ? `0${num}` : num.toString();
}

const DEFAULT_LABELS = {
	hours: '',
	minutes: '',
	seconds: ''
};

export default {
	/** 
	 * @param {number} miliseconds
	 * @param {string} delimeter
	 * @param  {{hours: string, minutes: string, seconds: string}} labels
	 * @return {string}
	 */
	milisToTime: (miliseconds, delimeter = ':', labels = DEFAULT_LABELS) => {
		let sec = (miliseconds/1000)|0;
		let min = (sec/60)|0;
		sec -= min*60;
		let hour = (min/60)|0;
		min -= hour*60;
		if(hour > 0)
			return `${zeroPad(hour)}${labels.hours}${delimeter}${zeroPad(min)}${labels.minutes}${delimeter}${zeroPad(sec)}${labels.seconds}`;
		else if(min > 0)
			return `${zeroPad(min)}${labels.minutes}${delimeter}${zeroPad(sec)}${labels.seconds}`;
		else
			return `${zeroPad(sec)}${labels.seconds}`;
	}
};