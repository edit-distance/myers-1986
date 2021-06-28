import assert from 'assert';

import lBound from './lBound.js';
import uBound from './uBound.js';
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
 * @param {{[x: number]: number, length: number}} V
 * @param {number} centerF
 * @param {number} centerB
 * @param {Function} eq
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @return {Split}
 */
export default function twoWayScan(
	MAX,
	V,
	centerF,
	centerB,
	eq,
	li,
	lj,
	ri,
	rj,
) {
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

	const DMAX = Math.min(HALF_MAX, (MAX + parityDelta) >> 1);

	if (DMAX !== 0) {
		assert(DMAX >= 1);

		if (parityDelta === 0) {
			backwardStep(V, centerB - 1, centerB + 1, centerB - 1);
		}

		const cFmD0 = centerF - Delta0;
		const cBmD1 = centerB - Delta1;
		const cBDcF = cBmD1 - cFmD0;
		let D = 1;
		let LBprev = -1;
		let UBprev = 1;
		let LB = -1;
		let UB = 1;
		// eslint-disable-next-line no-constant-condition
		while (true) {
			assert(2 * D <= MAX + parityDelta);
			assert(LB <= UB);
			assert(LB !== D);
			assert(UB !== -D);
			forwardStep(V, centerF + LB, centerF + UB, centerF + D);
			const kMin = Math.max(LB, Delta - (D - parityDelta));
			assert(kMin >= LB);
			assert((kMin & 1) === (LB & 1));
			const kMax = Math.min(UB, Delta + (D - parityDelta));
			assert(kMax <= UB);
			assert((kMax & 1) === (UB & 1));
			assert((kMin & 1) === (kMax & 1));
			const cMin = centerF + kMin;
			const cMax = centerF + kMax;
			if (cMin <= cMax) {
				let c = cMin;
				do {
					const x = V[c];
					// Const y = x - (c - cFD0); // X - (k + Delta0)
					V[c] = longestCommonPrefix(eq, x, lj, x - (c - cFmD0), rj);
					if (V[c] === V[c + cBDcF]) {
						// XEnd === V[centerB + k - Delta]
						return new Split(
							c - cFmD0, // K + Delta0
							longestCommonSuffix(eq, x, li, x - (c - cFmD0), ri),
							V[c],
							D,
							(D << 1) - parityDelta,
						);
					}

					assert(V[c] < V[c + cBDcF]); // WTF???
					c += 2;
				} while (c <= cMax);

				if (D === DMAX) break; // This is where we break the loop
				forwardExtend(centerF + LB, cMin - 2, cFmD0, V, eq, lj, rj);
				forwardExtend(cMax + 2, centerF + UB, cFmD0, V, eq, lj, rj);
			} else {
				if (D === DMAX) break; // This is where we break the loop
				forwardExtend(centerF + LB, centerF + UB, cFmD0, V, eq, lj, rj);
			}

			if (parityDelta === 0) {
				const LB_ = -UB;
				const UB_ = -LB;
				assert(LB_ <= UB_);
				assert(LB_ !== D);
				assert(UB_ !== -D);
				const cMin = centerB - UB;
				const cMax = centerB - LB;
				backwardExtend(cMin, cMax, cBmD1, V, eq, li, ri);

				// LBprev = LB; // No need to update since we do not use them.
				// UBprev = UB;
				LB = lBound(++D, rj - ri); // This is where D is incremented.
				UB = uBound(D, lj - li);
				backwardStep(V, centerB - UB, centerB - LB, centerB - D);
			} else {
				assert(parityDelta === 1);
				if (D !== 1) {
					assert(D >= 2);
					const LB_ = -UBprev;
					const UB_ = -LBprev;
					assert(LB_ <= UB_);
					assert(LB_ !== D - 1);
					assert(UB_ !== -(D - 1));
					const cMin = centerB - UBprev;
					const cMax = centerB - LBprev;
					backwardExtend(cMin, cMax, cBmD1, V, eq, li, ri);
				}

				backwardStep(V, centerB - UB, centerB - LB, centerB - D);
				LBprev = LB;
				UBprev = UB;
				LB = lBound(++D, rj - ri); // This is where D is incremented.
				UB = uBound(D, lj - li);
			}
		}
	}

	return new Split(-1, -1, -1, -1, -1);
}
