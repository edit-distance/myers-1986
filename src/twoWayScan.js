import assert from 'assert';

import bound from './bound.js';
import forwardStep from './forwardStep.js';
import forwardExtend from './forwardExtend.js';
import backwardStep from './backwardStep.js';
import backwardExtend from './backwardExtend.js';
import longestCommonPrefix from './longestCommonPrefix.js';
import longestCommonSuffix from './longestCommonSuffix.js';
import Split from './Split.js';

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
 * @return {Split}
 */
const twoWayScan = (MAX, V, centerF, centerB, eq, li, lj, ri, rj) => {
	assert(MAX >= 1);
	assert(MAX <= lj - li + rj - ri);
	assert(li < lj);
	assert(ri < rj);
	assert(!eq(li, ri));
	assert(!eq(lj - 1, rj - 1));

	// Math.ceil(MAX / 2); triggers deopt lost precision
	const HALF_MAX = (MAX >> 1) + (MAX & 1);
	assert(HALF_MAX >= 1);

	const Delta0 = li - ri;
	const Delta1 = lj - rj;
	const Delta = Delta1 - Delta0;

	const parityDelta = Delta & 1; // Delta % 2 does not work when Delta < 0
	assert(parityDelta === 0 || parityDelta === 1);

	if (parityDelta === 0) {
		backwardStep(centerB, 1, V, lj, li, rj, ri);
	}

	const cFD0 = centerF - Delta0;
	for (let D = 1; D <= HALF_MAX; ++D) {
		if (2 * D > MAX + parityDelta) break;
		const LB = -bound(D, rj - ri);
		const UB = bound(D, lj - li);
		assert(LB <= UB);
		assert(LB !== D);
		assert(UB !== -D);
		forwardStep(centerF, D, V, LB, UB); // , li, lj, ri, rj, Delta0);
		const kMin = Math.max(LB, -D + parityDelta + Delta);
		assert(kMin >= LB);
		assert((kMin & 1) === (LB & 1));
		const kMax = Math.min(UB, D - parityDelta + Delta);
		assert(kMax <= UB);
		assert((kMax & 1) === (UB & 1));
		assert((kMin & 1) === (kMax & 1));
		const cMin = centerF + kMin;
		const cMax = centerF + kMax;
		for (let k = kMin; k <= kMax; k += 2) {
			const x = V[centerF + k];
			const y = x - (k + Delta0);
			const xEnd = longestCommonPrefix(eq, x, lj, y, rj);
			V[centerF + k] = xEnd;
			if (xEnd < V[centerB + k - Delta]) continue;
			assert(xEnd === V[centerB + k - Delta]); // WTF???
			return new Split(
				k + Delta0,
				longestCommonSuffix(eq, x, li, y, ri),
				xEnd,
				D,
				2 * D - parityDelta,
			);
		}

		if (D === HALF_MAX) break;

		// Like backward extend but forward and only for k's not covered in the
		// output loop
		if (cMin <= cMax) {
			forwardExtend(centerF + LB, cMin - 2, cFD0, V, eq, lj, rj);
			forwardExtend(cMax + 2, centerF + UB, cFD0, V, eq, lj, rj);
		} else {
			forwardExtend(centerF + LB, centerF + UB, cFD0, V, eq, lj, rj);
		}

		if (D > parityDelta) {
			backwardExtend(centerB, D - parityDelta, V, eq, lj, li, rj, ri, Delta1);
		}

		backwardStep(centerB, D + 1 - parityDelta, V, lj, li, rj, ri);
	}

	return new Split(-1, -1, -1, -1, -1);
};

export default twoWayScan;
