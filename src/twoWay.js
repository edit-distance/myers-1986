import assert from 'assert';

import twoWayAlloc from './twoWayAlloc.js';
import twoWayScan from './twoWayScan.js';

/**
 * Scan from begin to middle and end to middle.
 *
 * @param {number} MAX
 * @param {Function} eq
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @return {Object}
 */
const twoWay = (MAX, eq, li, lj, ri, rj) => {
	assert(MAX > 0);
	assert(MAX <= lj - li + rj - ri);
	assert(li < lj);
	assert(ri < rj);
	assert(!eq(li, ri));
	assert(!eq(lj - 1, rj - 1));

	const {V, centerF, centerB} = twoWayAlloc(MAX, li, lj, ri, rj);

	return twoWayScan(MAX, V, centerF, centerB, eq, li, lj, ri, rj);
};

export default twoWay;
