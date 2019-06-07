//@ts-check
import {AVAILABLE_MAPS} from './map_data';

/** @param  {string} map_name */
function build_key(map_name) {
	return `map_result:${map_name}`;
}

const MapRecords = {
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
	},

	clear: () => {
		for(let map of AVAILABLE_MAPS) localStorage.removeItem(build_key(map.name));
	},

	/** 
	 * @param  {string} map_name
	 * @return {boolean}
	 */
	isUnlocked: (map_name) => {
		if( MapRecords.getRecord(map_name) !== null )
			return true;

		let curr_index = AVAILABLE_MAPS.findIndex(map => map.name === map_name);
		if(curr_index === 0)//first map is always avaible for player
			return true;
		else if(curr_index > 0)
			return MapRecords.getRecord( AVAILABLE_MAPS[curr_index-1].name ) !== null;
		else
			return false;
	}
};

export default MapRecords;