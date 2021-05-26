import assert from 'assert';

import diagonalAlloc from './diagonalAlloc.js';
import diagonalStep from './diagonalStep.js';
import longestCommonPrefix from './longestCommonPrefix.js';

/**
 * Greedy.
 *
 * @param {number} MAX
 * @param {ArrayLike} left
 * @param {ArrayLike} right
 * @return {number}
 */
const diagonalScan = (MAX, left, right) => {
	assert(Number.isInteger(MAX));
	const N = left.length;
	const M = right.length;
	assert(MAX <= N + M);

	if (MAX < 0) return -1;

	if (MAX === 0) return left === right ? 0 : -1;

	const V = diagonalAlloc(MAX);

	for (let D = 0; D <= MAX; ++D) {
		for (const k of diagonalStep(
			1,
			longestCommonPrefix,
			MAX,
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
			const x = V[MAX + k];
			const y = x - k;
			if (x === N && y === M) return D;
		}
	}

	return -1;
};

export default diagonalScan;
