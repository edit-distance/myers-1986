import assert from 'assert';

import diagonalAlloc from './diagonalAlloc.js';
import diagonalStep from './diagonalStep.js';
import longestCommonPrefix from './longestCommonPrefix.js';
import makeEqualityFn from './makeEqualityFn.js';
import defaultTest from './defaultTest.js';

/**
 * Greedy.
 *
 * @param {number} MAX
 * @param {ArrayLike} left
 * @param {number} li
 * @param {number} lj
 * @param {ArrayLike} right
 * @param {number} ri
 * @param {number} rj
 * @param {Function} [test=defaultTest]
 * @return {number}
 */
const diagonalScan = (MAX, left, li, lj, right, ri, rj, test = defaultTest) => {
	assert(Number.isInteger(MAX));
	const N = lj - li;
	const M = rj - ri;
	assert(MAX <= N + M);

	if (MAX < 0) return -1;

	const eq = makeEqualityFn(test, left, right);

	if (MAX === 0)
		return M === N && longestCommonPrefix(eq, li, lj, ri, rj) === lj ? 0 : -1;

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

export default diagonalScan;
