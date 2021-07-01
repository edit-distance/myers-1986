import assert from 'assert';

import oneWayAlloc from './oneWayAlloc.js';
import forwardStep from './forwardStep.js';
import lBound from './lBound.js';
import uBound from './uBound.js';
import longestCommonPrefix from './longestCommonPrefix.js';
import Split from './Split.js';

/**
 * Scan from begin to end.
 *
 * @param {number} MAX
 * @param {Function} eq
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @return {Split}
 */
export default function oneWay(MAX, eq, li, lj, ri, rj) {
	assert(MAX > 0);
	assert(MAX <= lj - li + rj - ri);
	assert(li < lj);
	assert(ri < rj);
	assert(!eq(li, ri));
	assert(!eq(lj - 1, rj - 1));

	const {array: V, center} = oneWayAlloc(MAX, li, lj, ri, rj, li);

	const Delta0 = (li - ri) | 0;
	const ln = (lj - li) | 0;
	const rn = (rj - ri) | 0;
	const DMAX = Math.min(MAX, (((ln + rn) | 0) - 1) | 0);
	for (let D = 1; D <= DMAX; D = (D + 1) | 0) {
		const LB = lBound(D, rn);
		const UB = uBound(D, ln);
		assert(LB < UB);
		assert(LB !== D);
		assert(UB !== -D);
		forwardStep(V, (center + LB) | 0, (center + UB) | 0, (center + D) | 0);
		for (let k = LB; k <= UB; k = (k + 2) | 0) {
			const x_ = V[(center + k) | 0];
			const y_ = (x_ - ((k + Delta0) | 0)) | 0;
			const x = longestCommonPrefix(eq, x_, lj, y_, rj);
			const y = (x - ((k + Delta0) | 0)) | 0;
			if (x === lj && y === rj) return new Split(-1, -1, -1, -1, D);
			V[(center + k) | 0] = x;
		}
	}

	return MAX === ((ln + rn) | 0)
		? new Split(-1, -1, -1, -1, MAX)
		: new Split(-1, -1, -1, -1, -1);
}
