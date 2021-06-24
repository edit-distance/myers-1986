import assert from 'assert';

import boundAlloc from './boundAlloc.js';

/**
 * TwoWayRealloc.
 *
 * @param {Int32Array} V
 * @param {number} MAX
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @return {{centerF: number, centerB: number}}
 */
export default function twoWayRealloc (V, MAX, li, lj, ri, rj) {
	const HALF_MAX = (MAX >> 1) + (MAX & 1); // Ceil(MAX / 2);

	const lMAX = boundAlloc(HALF_MAX, li, lj);
	const rMAX = boundAlloc(HALF_MAX, ri, rj);
	const n = rMAX + 1 + lMAX;
	assert(rMAX + 1 < n);

	assert(V.length >= 2 * n);
	V.fill(li, 0, n);
	V.fill(lj, n, 2 * n);
	const centerF = rMAX;
	const centerB = n + lMAX;

	return {
		centerF,
		centerB,
	};
}
