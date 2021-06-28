import assert from 'assert';

import boundAlloc from './boundAlloc.js';
import arrayAlloc from './arrayAlloc.js';

/**
 * DiagonalAlloc.
 *
 * @param {number} MAX
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @param {number} init
 */
export default function oneWayAlloc(MAX, li, lj, ri, rj, init) {
	const lMAX = boundAlloc(MAX, li, lj);
	const rMAX = boundAlloc(MAX, ri, rj);
	assert(rMAX + 1 < rMAX + 1 + lMAX);
	return {
		array: arrayAlloc(lj, (((rMAX + 1) | 0) + lMAX) | 0).fill(init),
		center: rMAX,
	};
}
