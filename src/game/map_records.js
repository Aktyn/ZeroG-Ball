//@ts-check

/** @param  {string} map_name */
function build_key(map_name) {
	return `map_result:${map_name}`;
}

export default {
	/** 
	 * @param  {string} map_name
	 * @return {number | null}
	 */
	getRecord: (map_name) => {
		let current_record = localStorage.getItem( build_key(map_name) );
		if(typeof current_record === 'string' || typeof current_record === 'number')
			return parseFloat(current_record);
		else
			return null;
	},
	/**
	 * @param  {string} map_name
	 * @param  {number} time
	 */
	saveRecord: (map_name, time) => {
		const record_key = build_key(map_name);
		let current_record = localStorage.getItem(record_key);
		
		if(!current_record || parseFloat(current_record) > time) {
			console.log('new map record saved');
			localStorage.setItem(record_key, time.toString());
		}
	}
}