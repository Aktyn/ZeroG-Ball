var COMMANDS = [];
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();
recognition.lang = 'pl-PL';
recognition.continuous = true;
recognition.interimResults = false;
recognition.maxAlternatives = 5;

const SPEECH_COMMANDS = {
    start : () => {
        recognition.start();
        recognition.onstart = () => {
            console.log('recognition started');
        }
    },

    stop : () => {
        recognition.stop();
        recognition.onend = () => {
            console.log('recognition ended');
        }
    },

    result : (value, callback) => {
        COMMANDS.push({value: value, callback: callback});
    },

    match : () => {
        recognition.onresult = () => {
        let result = event.results[event.results.length-1];
        let index;

        if(!result.isFinal) {
            console.log(result[0].transcript);
            index = COMMANDS.findIndex(i => i.value.replace(/\s/g, '').toLowerCase() === result[0].transcript.replace(/\s/g, '').toLowerCase());
            if(index !== -1)
                COMMANDS[index].callback();
            return;

        }

        console.log(event.resultIndex, result[0].transcript, result[0].confidence);
        index = COMMANDS.findIndex(i => i.value.replace(/\s/g, '').toLowerCase() === result[0].transcript.replace(/\s/g, '').toLocaleLowerCase());

        if(index !== -1) COMMANDS[index].callback();

        for(let j=1; j<result.length; j++) {
            console.log('\talternative:', result[j].transcript);
            index = COMMANDS.findIndex(i => i.value.replace(/\s/g, '').toLowerCase() === result[j].transcript.replace(/\s/g, '').toLowerCase());
            if(index !== -1) {
                COMMANDS[index].callback();
                return;
            }
        }
        }
    }
};

export default SPEECH_COMMANDS;
