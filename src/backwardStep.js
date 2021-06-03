import assert from 'assert';

import bound from './bound.js';
/**
 * Diagonal backward step.
 *
 * @param {number} center
 * @param {number} D
 * @param {Int32Array} V
 * @param {Function} eq
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @param {number} Delta
 */
export default function backwardStep(center, D, V, eq, li, lj, ri, rj, Delta) {
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
		eq,
		li,
		lj,
		ri,
		rj,
		LB,
		UB,
		Delta,
	});

	const cx = center + 1;
	const cy = center - 1;

	const k = LB;
	const xp = V[cx + k];
	const yp = V[cy + k];
	V[center + k] = k !== -D && xp > yp ? yp : xp - 1;

	for (let k = LB + 2; k < UB; k += 2) {
		assert(k !== -D && k !== D);
		const xp = V[cx + k];
		const yp = V[cy + k];
		V[center + k] = xp > yp ? yp : xp - 1;
	}

	if (UB !== LB) {
		const k = UB;
		const xp = V[cx + k];
		const yp = V[cy + k];
		assert(k === D || xp > yp);
		V[center + k] = yp;
	}

	console.debug('end backwardStep', {
		center,
		D,
		V,
		eq,
		li,
		lj,
		ri,
		rj,
		Delta,
	});
}
