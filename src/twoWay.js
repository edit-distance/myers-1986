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
 * @return {Object}
 */
const twoWay = (MAX, eq, li, lj, ri, rj) => {
	assert(MAX > 0);
	assert(MAX <= lj - li + rj - ri);
	assert(li < lj);
	assert(ri < rj);
	assert(!eq(li, ri));
	assert(!eq(lj - 1, rj - 1));

	const HALF_MAX = Math.ceil(MAX / 2);

	const {array: V, center: centerV} = diagonalAlloc(HALF_MAX, li, lj, ri, rj);
	V.fill(li);
	const {array: W, center: centerW} = diagonalAlloc(HALF_MAX, ri, rj, li, lj);
	W.fill(lj);

	const Delta0 = li - ri;
	const Delta1 = lj - rj;
	const Delta = Delta1 - Delta0;

	const parityDelta = Delta % 2;

	for (let D = 1; D <= HALF_MAX; ++D) {
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
			return {
				k: k + Delta0,
				xBegin: W[centerW + k - Delta],
				xEnd: V[centerV + k],
				distance: 2 * D - 1,
				distanceLeft: D,
				distanceRight: D - 1,
			};
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
			return {
				k: k + Delta1,
				xBegin: W[centerW + k],
				xEnd: V[centerV + k + Delta],
				distance: 2 * D,
				distanceLeft: D,
				distanceRight: D,
			};
		}
	}

	return {
		distance: -1,
	};
};

export default twoWay;
