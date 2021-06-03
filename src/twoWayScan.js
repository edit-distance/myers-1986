import assert from 'assert';

import forwardStep from './forwardStep.js';
import backwardStep from './backwardStep.js';
import backwardExtend from './backwardExtend.js';
import longestCommonPrefix from './longestCommonPrefix.js';
import longestCommonSuffix from './longestCommonSuffix.js';

/**
 * Scan from begin to middle and end to middle.
 *
 * @param {number} MAX
 * @param {Int32Array} V
 * @param {number} centerF
 * @param {number} centerB
 * @param {Function} eq
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @return {Object}
 */
const twoWayScan = (MAX, V, centerF, centerB, eq, li, lj, ri, rj) => {
	assert(MAX >= 1);
	assert(MAX <= lj - li + rj - ri);
	assert(li < lj);
	assert(ri < rj);
	assert(!eq(li, ri));
	assert(!eq(lj - 1, rj - 1));

	const HALF_MAX = Math.ceil(MAX / 2);
	assert(HALF_MAX >= 1);

	const Delta0 = li - ri;
	const Delta1 = lj - rj;
	const Delta = Delta1 - Delta0;

	const parityDelta = Delta & 1; // Delta % 2 does not work when Delta < 0
	assert(parityDelta === 0 || parityDelta === 1);

	if (parityDelta === 0) {
		backwardStep(centerB, 1, V, eq, lj, li, rj, ri, Delta1);
	}

	for (let D = 1; D <= HALF_MAX; ++D) {
		if (2 * D > MAX + parityDelta) break;
		for (const k of forwardStep(centerF, D, V, eq, li, lj, ri, rj, Delta0)) {
			const x = V[centerF + k];
			const y = x - (k + Delta0);
			V[centerF + k] = longestCommonPrefix(eq, x, lj, y, rj);
			if (k - Delta < -(D - parityDelta)) continue;
			if (k - Delta > D - parityDelta) continue;
			if (V[centerF + k] < V[centerB + k - Delta]) continue; // TODO this scans the snake twice
			return {
				k: k + Delta0,
				xBegin: longestCommonSuffix(eq, x, li, y, ri),
				xEnd: V[centerF + k],
				distance: 2 * D - parityDelta,
				distanceLeft: D,
				distanceRight: D - parityDelta,
			};
		}

		if (D === HALF_MAX) break;

		if (D > parityDelta) {
			backwardExtend(centerB, D - parityDelta, V, eq, lj, li, rj, ri, Delta1);
		}

		backwardStep(centerB, D + 1 - parityDelta, V, eq, lj, li, rj, ri, Delta1);
	}

	return {
		distance: -1,
	};
};

export default twoWayScan;
