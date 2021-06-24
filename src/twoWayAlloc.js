import assert from 'assert';

import boundAlloc from './boundAlloc.js';

/**
 * TwoWayAlloc.
 *
 * @param {number} MAX
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @return {{V: Int32Array, centerF: number, centerB: number}}
 */
export default function twoWayAlloc (MAX, li, lj, ri, rj) {
	const HALF_MAX = (MAX >> 1) + (MAX & 1); // Ceil(MAX / 2);

	const lMAX = boundAlloc(HALF_MAX, li, lj);
	const rMAX = boundAlloc(HALF_MAX, ri, rj);
	const n = rMAX + 1 + lMAX;
	assert(rMAX + 1 < n);

	const V = new Int32Array(2 * n);
	V.fill(li, 0, n);
	V.fill(lj, n, 2 * n);
	const centerF = rMAX;
	const centerB = n + lMAX;

	return {
		V,
		centerF,
		centerB,
	};
}
