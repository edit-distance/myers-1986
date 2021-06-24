import assert from 'assert';

import bound from './bound.js';
/**
 * Diagonal backward step.
 *
 * @param {number} center
 * @param {number} D
 * @param {Int32Array} V
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 */
export default function backwardStep(center, D, V, li, lj, ri, rj) {
	assert(ri > rj && li > lj);
	// NOTE: We make the bounding box as small as possible.
	// This should save roughly half of the computation time compared to
	// letting LB = -D and UB = D.
	const LB = -bound(D, li - lj);
	const UB = bound(D, ri - rj);
	assert(LB <= UB);
	assert(LB !== D);
	assert(UB !== -D);

	console.debug('beg backwardStep', {
		center,
		D,
		V,
		li,
		lj,
		ri,
		rj,
		LB,
		UB,
	});

	const cMin = center + LB;
	const cMax = center + UB;

	V[cMin] =
		LB !== -D && V[cMin + 1] > V[cMin - 1] ? V[cMin - 1] : V[cMin + 1] - 1;

	for (let c = cMin + 2; c < cMax; c += 2) {
		assert(c - center !== -D && c - center !== D);
		V[c] = V[c + 1] > V[c - 1] ? V[c - 1] : V[c + 1] - 1;
	}

	if (UB !== LB) {
		const yp = V[cMax - 1];
		assert(UB === D || V[cMax + 1] > yp); // UB === D || xp > yp
		V[cMax] = yp;
	}

	console.debug('end backwardStep', {
		center,
		D,
		V,
		li,
		lj,
		ri,
		rj,
	});
}
