import assert from 'assert';

import bound from './bound.js';
import forwardStep from './forwardStep.js';
import forwardExtend from './forwardExtend.js';
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
		backwardStep(centerB, 1, V, lj, li, rj, ri);
	}

	for (let D = 1; D <= HALF_MAX; ++D) {
		if (2 * D > MAX + parityDelta) break;
		forwardStep(centerF, D, V, eq, li, lj, ri, rj, Delta0);
		const LB = -bound(D, rj - ri);
		const UB = bound(D, lj - li);
		assert(LB <= UB);
		assert(LB !== D);
		assert(UB !== -D);
		const kMin = Math.max(LB, -D + parityDelta + Delta);
		assert(kMin >= LB);
		assert((kMin & 1) === (LB & 1));
		const kMax = Math.min(UB, D - parityDelta + Delta);
		assert(kMax <= UB);
		assert((kMax & 1) === (UB & 1));
		assert((kMin & 1) === (kMax & 1));
		for (let k = kMin; k <= kMax; k += 2) {
			const x = V[centerF + k];
			const y = x - (k + Delta0);
			const xEnd = longestCommonPrefix(eq, x, lj, y, rj);
			V[centerF + k] = xEnd;
			if (xEnd < V[centerB + k - Delta]) continue;
			assert(xEnd === V[centerB + k - Delta]); // WTF???
			return {
				k: k + Delta0,
				xBegin: longestCommonSuffix(eq, x, li, y, ri),
				xEnd,
				distance: 2 * D - parityDelta,
				distanceLeft: D,
				distanceRight: D - parityDelta,
			};
		}

		if (D === HALF_MAX) break;

		// Like backward extend but forward and only for k's not covered in the
		// output loop
		if (kMin <= kMax) {
			forwardExtend(LB, kMin - 2, Delta0, centerF, V, eq, lj, rj);
			forwardExtend(kMax + 2, UB, Delta0, centerF, V, eq, lj, rj);
		} else {
			forwardExtend(LB, UB, Delta0, centerF, V, eq, lj, rj);
		}

		if (D > parityDelta) {
			backwardExtend(centerB, D - parityDelta, V, eq, lj, li, rj, ri, Delta1);
		}

		backwardStep(centerB, D + 1 - parityDelta, V, lj, li, rj, ri);
	}

	return {
		distance: -1,
	};
};

export default twoWayScan;
