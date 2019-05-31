//@ts-check
import Settings, {SPEECH_RECOGNITION_DEFAULTS} from './settings';

/** @type {{[index: string]: string[]}} list of avaible commands with their corresponding keywords */
export var COMMANDS = {};//loads from Settings

/** @type {{[index: string]: Function}} */
var listeners = {};

/** @type {Function} */
var start_listener = null;
/** @type {Function} */
var end_listener = null;

/** 
 * @param  {string} result
 * @return {boolean}
 */
function checkResult(result) {
	for(let command_name in COMMANDS) {
		if(command_name in listeners === false)//no listener assigned for this command
			continue;
		for(let keyword of COMMANDS[command_name]) {
			//look for keyword inside result string
			if( result.toLowerCase().indexOf( keyword.toLowerCase() ) !== -1 ) {
				listeners[command_name]();//callback
				return true;
			}
		}
	}
	return false;
}

//@ts-ignore
if(typeof webkitSpeechRecognition === 'undefined') {
	var fallbackRecognition = function Failback() {
		this.start = function(){};
	};
}

//@ts-ignore
var SpeechRecognition = SpeechRecognition || fallbackRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();
recognition.lang = 'pl-PL';
recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 5;

var recognition_active = false;
var recognition_start_timestamp = 0;
var ignore_index = -1;

recognition.onstart = () => {
	ignore_index = -1;
	recognition_active = true;
	recognition_start_timestamp = Date.now();
	console.log('recognition started');
	if(typeof start_listener === 'function')
		start_listener();
};
recognition.onend = () => {
	if(recognition_active) {
		if(Date.now() - recognition_start_timestamp > 1000) {//at least 1 second difference
			console.log('recognition restarted');
			recognition_active = false;
			recognition_start_timestamp = Date.now();
			recognition.start();//restart recognition
			return;
		}
	}
	else
		console.log('recognition ended');

	if(typeof end_listener === 'function')
		end_listener();
};

/** @param {SpeechRecognitionEvent} event */
recognition.onresult = (event) => {
	let result = event.results[event.results.length-1];
	let index;

	if(ignore_index === event.resultIndex) {//recognition already succeeded
		console.log('further results ignored');
		return;
	}

	if(!result.isFinal) {
		console.log('\tinterim:', result[0].transcript);
		if( checkResult(result[0].transcript) )
			ignore_index = event.resultIndex;
		return;

	}

	for(let j=0; j<result.length; j++) {
		console.log(`${j>0?'\talternative: ':'final: '}${result[j].transcript} (${result[j].confidence})`);
		if( checkResult(result[j].transcript) )
			return;
	}
}

const SPEECH_COMMANDS = {
	start: () => {
		//recognition_active = true;
		recognition_start_timestamp = 0;
		recognition.start();

		/**
		 * @param  {string} command_name
		 * @param  {string} keywords_str
		 */
		let applyKeywords = (command_name, keywords_str) => 
			COMMANDS[command_name] = keywords_str.split(',').map(c => c.trim()).filter(c => c.length > 0);

		//load keyword from settings
		for(let command in SPEECH_RECOGNITION_DEFAULTS) {
			//@ts-ignore
			applyKeywords(command, Settings.getValue(command));

			Settings.watch(command, (_keywords) => {
				//@ts-ignore
				applyKeywords(command, _keywords);
			});
		}
		
		//console.log(COMMANDS);
	},
	stop: () => {
		recognition_active = false;
		recognition.stop();
	},

	onStart: (callback) => {
		start_listener = callback;
	},

	onEnd: (callback) => {
		end_listener = callback;
	},

	isActive: () => {
		return recognition_active;
	},

	/**
	 * @param  {string}   command_name
	 * @param  {Function} callback
	 */
	onCommand: (command_name, callback) => {
		if(command_name in COMMANDS === false)
			throw new Error('Unsuported speech command: ' + command_name);
		listeners[command_name] = callback;
	}
};

export default SPEECH_COMMANDS;
