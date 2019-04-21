//@ts-check

/** @type {{[index: string]: string[]}} list of avaible coomands with their corresponding keywords */
var COMMANDS = {
	'open_settings': ['ustawienia', 'settings', 'preferencje']
};

/** @type {{[index: string]: Function}} */
var listeners = {};

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
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();
recognition.lang = 'pl-PL';
recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 5;

var recognition_active = false;
var ignore_index = -1;

recognition.onstart = () => console.log('recognition started');
recognition.onend = () => {
	if(recognition_active) {
		console.log('recognition restarted');
		SPEECH_COMMANDS.start();//restart recognition
	}
	else
		console.log('recognition ended');
}

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
		//event.stopPropagation();
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
		recognition_active = true;
		recognition.start()
	},
	stop: () => {
		recognition_active = false;
		recognition.stop()
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
