import assert from 'assert';

import diagonalAlloc from './diagonalAlloc.js';
import diagonalStep from './diagonalStep.js';
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
 * @return {number}
 */
const oneWay = (MAX, eq, li, lj, ri, rj) => {
	assert(MAX > 0);
	assert(MAX <= lj - li + rj - ri);

	const V = diagonalAlloc(MAX).fill(li);

	const Delta0 = li - ri;
	for (let D = 0; D <= MAX; ++D) {
		for (const k of diagonalStep(
			1,
			longestCommonPrefix,
			MAX,
			D,
			V,
			eq,
			li,
			lj,
			ri,
			rj,
			Delta0,
		)) {
			const x = V[MAX + k];
			const y = x - (k + Delta0);
			if (x === lj && y === rj) return D;
		}
	}

	return -1;
};

export default oneWay;
