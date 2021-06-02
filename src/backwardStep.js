import assert from 'assert';

import bound from './bound.js';
import longestCommonSuffix from './longestCommonSuffix.js';
/**
 * Diagonal backward step without yielding.
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
	const x = k !== -D && xp > yp ? yp : xp - 1;
	const y = x - (k + Delta);
	console.debug({k, x, lj, y, rj});

	if (x >= lj && y >= rj && x <= li && y <= ri) {
		V[center + k] = longestCommonSuffix(eq, x, lj, y, rj);
	}

	for (let k = LB + 2; k < UB; k += 2) {
		assert(k !== -D && k !== D);
		const xp = V[cx + k];
		const yp = V[cy + k];
		const x = xp > yp ? yp : xp - 1;
		const y = x - (k + Delta);
		console.debug({k, x, lj, y, rj});

		if (x >= lj && y >= rj && x <= li && y <= ri) {
			V[center + k] = longestCommonSuffix(eq, x, lj, y, rj);
		}
	}

	if (UB !== LB) {
		const k = UB;
		const xp = V[cx + k];
		const yp = V[cy + k];
		assert(k === D || xp > yp);
		const x = yp;
		const y = x - (k + Delta);
		console.debug({k, x, lj, y, rj});

		if (x >= lj && y >= rj && x <= li && y <= ri) {
			V[center + k] = longestCommonSuffix(eq, x, lj, y, rj);
		}
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
