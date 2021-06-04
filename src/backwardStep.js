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

	let c = center + LB;
	const cMax = center + UB;

	assert(c - center === LB);
	const xp = V[c + 1];
	const yp = V[c - 1];
	V[c] = LB !== -D && xp > yp ? yp : xp - 1;

	for (c += 2; c < cMax; c += 2) {
		assert(c - center !== -D && c - center !== D);
		const xp = V[c + 1];
		const yp = V[c - 1];
		V[c] = xp > yp ? yp : xp - 1;
	}

	if (UB !== LB) {
		assert(c - center === UB);
		const xp = V[c + 1];
		const yp = V[c - 1];
		assert(c - center === D || xp > yp);
		V[c] = yp;
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
