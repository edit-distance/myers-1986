import assert from 'assert';

import diagonalAlloc from './diagonalAlloc.js';
import diagonalStep from './diagonalStep.js';
import longestCommonPrefix from './longestCommonPrefix.js';
import longestCommonSuffix from './longestCommonSuffix.js';

/**
 * Scan from begin to middle and end to middle.
 *
 * @param {number} MAX
 * @param {Function} eq
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @return {number}
 */
const twoWay = (MAX, eq, li, lj, ri, rj) => {
	assert(MAX > 0);
	assert(MAX <= lj - li + rj - ri);

	const HALF_MAX = Math.ceil(MAX / 2);

	const {array: V, center: centerV} = diagonalAlloc(HALF_MAX, li, lj, ri, rj);
	V.fill(li);
	const {array: W, center: centerW} = diagonalAlloc(HALF_MAX, ri, rj, li, lj);
	W.fill(lj);

	const Delta0 = li - ri;
	const Delta1 = lj - rj;
	const Delta = Delta1 - Delta0;

	const parityDelta = Delta % 2;

	for (let D = 0; D <= HALF_MAX; ++D) {
		for (const k of diagonalStep(
			1,
			longestCommonPrefix,
			centerV,
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
			if (V[centerV + k] < W[centerW + k - Delta]) continue; // TODO this scans the snake twice
			return 2 * D - 1;
		}

		if (2 * D > MAX) break;

		for (const k of diagonalStep(
			-1,
			longestCommonSuffix,
			centerW,
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
			if (V[centerV + k + Delta] < W[centerW + k]) continue; // TODO this scans the snake twice
			return 2 * D;
		}
	}

	return -1;
};

export default twoWay;
