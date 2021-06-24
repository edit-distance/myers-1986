import assert from 'assert';

import boundAlloc from './boundAlloc.js';

/**
 * DiagonalAlloc.
 *
 * @param {number} MAX
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @param {number} init
 * @return {{array: Int32Array, center: number}}
 */
export default function oneWayAlloc (MAX, li, lj, ri, rj, init) {
	const lMAX = boundAlloc(MAX, li, lj);
	const rMAX = boundAlloc(MAX, ri, rj);
	assert(rMAX + 1 < rMAX + 1 + lMAX);
	return {
		array: new Int32Array(rMAX + 1 + lMAX).fill(init),
		center: rMAX,
	};
}
