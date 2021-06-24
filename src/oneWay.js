import assert from 'assert';

import oneWayAlloc from './oneWayAlloc.js';
import forwardStep from './forwardStep.js';
import bound from './bound.js';
import longestCommonPrefix from './longestCommonPrefix.js';

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
		const LB = -bound(D, rj - ri);
		const UB = bound(D, lj - li);
		assert(LB <= UB);
		assert(LB !== D);
		assert(UB !== -D);
		forwardStep(center, D, V, LB, UB);
		for (let k = LB; k <= UB; k += 2) {
			let x = V[center + k];
			let y = x - (k + Delta0);
			x = longestCommonPrefix(eq, x, lj, y, rj);
			y = x - (k + Delta0);
			if (x === lj && y === rj)
				return {
					distance: D,
				};
			V[center + k] = x;
		}
	}

	return {
		distance: -1,
	};
};

export default oneWay;
