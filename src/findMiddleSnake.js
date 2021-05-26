import assert from 'assert';

import diagonalAlloc from './diagonalAlloc.js';
import diagonalStep from './diagonalStep.js';
import longestCommonPrefix from './longestCommonPrefix.js';
import longestCommonSuffix from './longestCommonSuffix.js';

/**
 * FindMiddleSnake.
 *
 *
 * @param {number} MAX
 * @param {ArrayLike} left
 * @param {ArrayLike} right
 * @return {number}
 */
const findMiddleSnake = (MAX, left, right) => {
	assert(Number.isInteger(MAX));
	const N = left.length;
	const M = right.length;
	assert(MAX <= N + M);

	if (MAX < 0) return -1;

	if (MAX === 0) return left === right ? 0 : -1;

	const HALF_MAX = Math.ceil(MAX / 2);

	const V = diagonalAlloc(HALF_MAX);
	const W = diagonalAlloc(HALF_MAX).fill(N);

	const Delta = N - M;

	for (let D = 0; D <= HALF_MAX; ++D) {
		for (const k of diagonalStep(
			1,
			longestCommonPrefix,
			HALF_MAX,
			D,
			V,
			left,
			0,
			N,
			right,
			0,
			M,
			0,
		)) {
			if (Delta % 2 === 0) continue;
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
			left,
			N,
			0,
			right,
			M,
			0,
			Delta,
		)) {
			if (Delta % 2 === 1) continue;
			if (k + Delta < -D) continue;
			if (k + Delta > D) continue;
			if (V[HALF_MAX + k + Delta] < W[HALF_MAX + k]) continue; // TODO this scans the snake twice
			return 2 * D;
		}
	}

	return -1;
};

export default findMiddleSnake;
