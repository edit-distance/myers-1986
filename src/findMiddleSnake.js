import assert from 'assert';

import diagonalAlloc from './diagonalAlloc.js';
import diagonalStep from './diagonalStep.js';
import longestCommonPrefix from './longestCommonPrefix.js';
import longestCommonSuffix from './longestCommonSuffix.js';
import makeEqualityFn from './makeEqualityFn.js';
import defaultTest from './defaultTest.js';

/**
 * FindMiddleSnake.
 *
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
const findMiddleSnake = (
	MAX,
	left,
	li,
	lj,
	right,
	ri,
	rj,
	test = defaultTest,
) => {
	assert(Number.isInteger(MAX));
	const N = lj - li;
	const M = rj - ri;
	assert(MAX <= N + M);

	if (MAX < 0) return -1;

	const eq = makeEqualityFn(test, left, right);

	if (MAX === 0)
		return M === N && longestCommonPrefix(eq, li, lj, ri, rj) === lj ? 0 : -1;

	const HALF_MAX = Math.ceil(MAX / 2);

	const V = diagonalAlloc(HALF_MAX).fill(li);
	const W = diagonalAlloc(HALF_MAX).fill(lj);

	const Delta0 = li - ri;
	const Delta1 = lj - rj;
	const Delta = Delta1 - Delta0;

	const parityDelta = Delta % 2;

	for (let D = 0; D <= HALF_MAX; ++D) {
		for (const k of diagonalStep(
			1,
			longestCommonPrefix,
			HALF_MAX,
			D,
			V,
			eq,
			li,
			lj,
			ri,
			rj,
			Delta0,
		)) {
			if (parityDelta === 0) continue;
			if (k - Delta < -(D - 1)) continue;
			if (k - Delta > D - 1) continue;
			if (V[HALF_MAX + k] < W[HALF_MAX + k - Delta]) continue; // TODO this scans the snake twice
			return 2 * D - 1;
		}

		if (2 * D > MAX) break;

		for (const k of diagonalStep(
			-1,
			longestCommonSuffix,
			HALF_MAX,
			D,
			W,
			eq,
			lj,
			li,
			rj,
			ri,
			Delta1,
		)) {
			if (parityDelta === 1) continue;
			if (k + Delta < -D) continue;
			if (k + Delta > D) continue;
			if (V[HALF_MAX + k + Delta] < W[HALF_MAX + k]) continue; // TODO this scans the snake twice
			return 2 * D;
		}
	}

	return -1;
};

export default findMiddleSnake;
