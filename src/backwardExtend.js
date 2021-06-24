import assert from 'assert';

import longestCommonSuffix from './longestCommonSuffix.js';
/**
 * Diagonal backward extension.
 *
 * @param {number} cMin
 * @param {number} cMax
 * @param {number} cx
 * @param {{[x: number]: number}} V
 * @param {Function} eq
 * @param {number} lj
 * @param {number} rj
 */
export default function backwardExtend(
	cMin,
	cMax,
	cx,
	V,
	eq,
	// Li,
	lj,
	// Ri,
	rj,
) {
	for (let c = cMin; c <= cMax; c += 2) {
		const x = V[c];
		const y = x - (c - cx);
		assert(x === lj - 2 || x === lj - 1 || x >= lj); // These should be true
		assert(y === rj - 2 || y === rj - 1 || y >= rj); // Provided you called
		// assert(x <= li); // BackwardStep(center, D, ...)
		// assert(y <= ri); // Just before.
		V[c] = longestCommonSuffix(eq, V[c], lj, V[c] - (c - cx), rj);
	}
}
