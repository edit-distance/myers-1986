import assert from 'assert';

import boundAlloc from './boundAlloc.js';
import arrayAlloc from './arrayAlloc.js';

/**
 * TwoWayAlloc.
 *
 * @param {number} MAX
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 */
export default function twoWayAlloc(MAX, li, lj, ri, rj) {
	const HALF_MAX = ((MAX >> 1) + (MAX & 1)) | 0; // Ceil(MAX / 2);

	const lMAX = boundAlloc(HALF_MAX, li, lj);
	const rMAX = boundAlloc(HALF_MAX, ri, rj);
	const n = (((rMAX + 1) | 0) + lMAX) | 0;
	assert(rMAX + 1 < n);

	const V = arrayAlloc(lj, n << 1);
	V.fill(li, 0, n);
	V.fill(lj, n, n << 1);
	const centerF = rMAX;
	const centerB = (n + lMAX) | 0;

	return {
		V,
		centerF,
		centerB,
	};
}
