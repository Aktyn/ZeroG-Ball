// collision filtering class
//@ts-check
export default class Filter {
	constructor() {
		this.category = ~0;
		this.mask = ~0;
	}

	setCategory(cat) {
		this.category = cat;
	}
	setMask(mask) {
		this.mask = mask;
	}

	/**
	 * @param  {Filter} filterA
	 * @param  {Filter} filterB
	 */
	static collide(filterA, filterB) {
		return !!((filterA.mask & filterB.category) && (filterA.category & filterB.mask));
	}
}