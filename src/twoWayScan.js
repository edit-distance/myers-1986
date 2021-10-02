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
	const HALF_MAX = ((MAX >> 1) + (MAX & 1)) | 0;
	assert(HALF_MAX >= 1);

	const Delta0 = (li - ri) | 0;
	const Delta1 = (lj - rj) | 0;
	const Delta = (Delta1 - Delta0) | 0;

	const parityDelta = Delta & 1; // Delta % 2 does not work when Delta < 0
	assert(parityDelta === 0 || parityDelta === 1);

	const DMAX = Math.min(HALF_MAX, (MAX + parityDelta) >> 1);

	if (DMAX !== 0) {
		assert(DMAX >= 1);

		if (parityDelta === 0) {
			backwardStep(V, (centerB - 1) | 0, (centerB + 1) | 0, (centerB - 1) | 0);
		}

		const cFmD0 = (centerF - Delta0) | 0;
		const cBmD1 = (centerB - Delta1) | 0;
		const cBDcF = (cBmD1 - cFmD0) | 0;
		let D = 1;
		let LBprev = -1;
		let UBprev = 1;
		let LB = -1;
		let UB = 1;
		// eslint-disable-next-line no-constant-condition
		while (true) {
			assert(2 * D <= MAX + parityDelta);
			assert(LB < UB);
			assert(LB !== D);
			assert(UB !== -D);
			forwardStep(V, (centerF + LB) | 0, (centerF + UB) | 0, (centerF + D) | 0);
			const kMin = Math.max(LB, (Delta - ((D - parityDelta) | 0)) | 0);
			assert(kMin >= LB);
			assert((kMin & 1) === (LB & 1));
			const kMax = Math.min(UB, (Delta + ((D - parityDelta) | 0)) | 0);
			assert(kMax <= UB);
			assert((kMax & 1) === (UB & 1));
			assert((kMin & 1) === (kMax & 1));
			const cMin = (centerF + kMin) | 0;
			const cMax = (centerF + kMax) | 0;
			if (cMin <= cMax) {
				let c = cMin;
				do {
					const x = V[c] | 0;
					// Const y = x - (c - cFD0); // X - (k + Delta0)
					V[c] = longestCommonPrefix(
						eq,
						x,
						lj,
						(x - ((c - cFmD0) | 0)) | 0,
						rj,
					);
					if ((V[c] | 0) === (V[(c + cBDcF) | 0] | 0)) {
						// XEnd === V[centerB + k - Delta]
						return new Split(
							(c - cFmD0) | 0, // K + Delta0
							longestCommonSuffix(eq, x, li, (x - ((c - cFmD0) | 0)) | 0, ri),
							V[c] | 0,
							D,
							((D << 1) - parityDelta) | 0,
						);
					}

					assert(V[c] < V[c + cBDcF]); // WTF???
					c = (c + 2) | 0;
				} while (c <= cMax);

				if (D === DMAX) break; // This is where we break the loop
				forwardExtend((centerF + LB) | 0, (cMin - 2) | 0, cFmD0, V, eq, lj, rj);
				forwardExtend((cMax + 2) | 0, (centerF + UB) | 0, cFmD0, V, eq, lj, rj);
			} else {
				if (D === DMAX) break; // This is where we break the loop
				forwardExtend(
					(centerF + LB) | 0,
					(centerF + UB) | 0,
					cFmD0,
					V,
					eq,
					lj,
					rj,
				);
			}

			if (parityDelta === 0) {
				const LB_ = -UB;
				const UB_ = -LB;
				assert(LB_ <= UB_);
				assert(LB_ !== D);
				assert(UB_ !== -D);
				const cMin = (centerB - UB) | 0;
				const cMax = (centerB - LB) | 0;
				backwardExtend(cMin, cMax, cBmD1, V, eq, li, ri);

				// LBprev = LB; // No need to update since we do not use them.
				// UBprev = UB;
				D = (D + 1) | 0;
				LB = lBound(D, (rj - ri) | 0); // This is where D is incremented.
				UB = uBound(D, (lj - li) | 0);
				backwardStep(
					V,
					(centerB - UB) | 0,
					(centerB - LB) | 0,
					(centerB - D) | 0,
				);
			} else {
				assert(parityDelta === 1);
				if (D !== 1) {
					assert(D >= 2);
					const LB_ = -UBprev;
					const UB_ = -LBprev;
					assert(LB_ <= UB_);
					assert(LB_ !== D - 1);
					assert(UB_ !== -(D - 1));
					const cMin = (centerB - UBprev) | 0;
					const cMax = (centerB - LBprev) | 0;
					backwardExtend(cMin, cMax, cBmD1, V, eq, li, ri);
				}

				backwardStep(
					V,
					(centerB - UB) | 0,
					(centerB - LB) | 0,
					(centerB - D) | 0,
				);
				LBprev = LB;
				UBprev = UB;
				D = (D + 1) | 0; // This is where D is incremented.
				LB = lBound(D, (rj - ri) | 0);
				UB = uBound(D, (lj - li) | 0);
			}
		}
	}

	return new Split(-1, -1, -1, -1, -1);
}
