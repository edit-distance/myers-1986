import assert from 'assert';

import oneWayAlloc from './oneWayAlloc.js';
import forwardStep from './forwardStep.js';

/**
 * Scan from begin to end.
 *
 * @param {number} MAX
 * @param {Function} eq
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @return {Object}
 */
const oneWay = (MAX, eq, li, lj, ri, rj) => {
	assert(MAX > 0);
	assert(MAX <= lj - li + rj - ri);
	assert(li < lj);
	assert(ri < rj);
	assert(!eq(li, ri));
	assert(!eq(lj - 1, rj - 1));

	const {array: V, center} = oneWayAlloc(MAX, li, lj, ri, rj, li);

	const Delta0 = li - ri;
	for (let D = 1; D <= MAX; ++D) {
		for (const k of forwardStep(center, D, V, eq, li, lj, ri, rj, Delta0)) {
			const x = V[center + k];
			const y = x - (k + Delta0);
			if (x === lj && y === rj)
				return {
					distance: D,
				};
		}
	}

	return {
		distance: -1,
	};
};

export default oneWay;
