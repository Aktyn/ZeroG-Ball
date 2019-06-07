//@ts-check
const fs = require('fs');
const path = require('path');

const MAX_RECORDS = 20;

//prepare folder for top X records for each map
const data_folder = path.join(__dirname, '..', 'ranking');
if(!fs.existsSync(data_folder)) {
	console.log('creating folder:', data_folder);
	fs.mkdirSync(data_folder);
}

/**
* 	@typedef {{
		nickname: string,
		time: number
	}} 
	RecordEntry
*/

/** @type {Map<string, RecordEntry[]>} Structure storing best records for each map */
let ranking = new Map();

//loading map records from files in data_folder
for(let map_file of fs.readdirSync(data_folder)) {
	try {
		let content = fs.readFileSync(path.join(data_folder, map_file), 'utf8');
		let map_name = Buffer.from(map_file, 'base64').toString();

		/** @type {RecordEntry[]} */
		let records = JSON.parse(content);
		ranking.set(map_name, records.sort((r1, r2) => r1.time - r2.time));
	}
	catch(e) {
		console.error(e);
	}
}
//console.log(ranking);

/**
* @param {string} map_name
*/
function saveToFile(map_name, records) {
	try {//Buffer.from('Hello World!').toString('base64');	
		let file_name = Buffer.from(map_name).toString('base64');
		fs.writeFileSync(path.join(data_folder, file_name), JSON.stringify(records), 'utf8');
	}
	catch(e) {
		console.error(e);
	}
}

module.exports = {
	/**
	 * @param {{map_name: string, time: number, nickname: string}}
	 */
	reportRecord({map_name, time, nickname}) {
		//console.log(map_name, time, nickname);
		
		//get records of given map_name
		let records = ranking.get(map_name) || ranking.set(map_name, []).get(map_name);
		let user_best = records.find(r => r.nickname === nickname);
		if(user_best) {//new record
			if(user_best.time > time) {
				user_best.time = time;
				saveToFile(map_name, records);
			}
		}
		else {//add new user
			if(records.length < MAX_RECORDS)
				records.push({nickname, time});
			else if(records[records.length-1].time > time) {
				records.pop();
				records.push({nickname, time});
			}
			else
				return;

			records = records.sort((r1, r2) => r1.time - r2.time);

			saveToFile(map_name, records);
		}
	},

	getRanking() {
		return ranking;
	}
}