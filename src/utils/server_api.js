//@ts-check
const PORT = 7331;

function postRequest(to, data) {
	if(!to.startsWith('/')) to = '/' + to;

	if(typeof data !== 'string')
		data = JSON.stringify(data);

	return fetch(location.protocol + '//' + location.hostname + ':' + PORT + to, {
		method: "POST",
		mode: /*process.env.NODE_ENV === 'development'*/true ? 'cors' : 'same-origin',
		headers: {"Content-Type": "application/json; charset=utf-8"},
		body: data
	}).then(res => res.json());
}

export default {
	async pingServer() {
		try {
			let res = await postRequest('/ping', {});
			return res.result === 'SUCCESS';
		}
		catch(e) {
			console.error(e);
			return false;
		}
	},

	/**
	 * @param {string} map_name name of completed map
	 * @param {number} time elapsed time in miliseconds
	 * @param {string} nickname
	 */
	async sendRecord(map_name, time, nickname) {
		try {
			let res = await postRequest('/save_result', {map_name, time, nickname});
			return res.result === 'SUCCESS';
		}
		catch(e) {
			console.error(e);
			return false;
		}
	},

	async getRanking() {
		try {
			let res = await postRequest('/get_ranking', {});
			if(res.result === 'SUCCESS')
				return res.data;
		}
		catch(e) {
			console.error(e);
			return [];
		}
	}
}