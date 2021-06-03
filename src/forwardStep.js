import assert from 'assert';

import bound from './bound.js';
/**
 * Diagonal forward step.
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
export default function forwardStep(center, D, V, eq, li, lj, ri, rj, Delta) {
	assert(ri < rj && li < lj);
	// NOTE: We make the bounding box as small as possible.
	// This should save roughly half of the computation time compared to
	// letting LB = -D and UB = D.
	const LB = -bound(D, rj - ri);
	const UB = bound(D, lj - li);
	assert(LB <= UB);
	assert(LB !== D);
	assert(UB !== -D);

	console.debug('beg forwardStep', {
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

	const cx = center - 1;
	const cy = center + 1;

	const k = LB;
	const xp = V[cx + k];
	const yp = V[cy + k];
	assert(k === -D || xp < yp);
	const x = yp;
	const y = x - (k + Delta);
	console.debug({k, x, lj, y, rj});

	assert(x <= lj);
	// Assert(y <= rj); // False sometimes
	assert(x >= li);
	assert(y >= ri);
	V[center + k] = x;

	for (let k = LB + 2; k < UB; k += 2) {
		assert(k !== -D && k !== D);
		const xp = V[cx + k];
		const yp = V[cy + k];
		const x = xp < yp ? yp : xp + 1;
		const y = x - (k + Delta);
		console.debug({k, x, lj, y, rj});

		// Assert(x <= lj); // False sometimes
		// assert(y <= rj); // False sometimes
		assert(x >= li);
		assert(y >= ri);
		V[center + k] = x;
	}

	if (UB !== LB) {
		const k = UB;
		const xp = V[cx + k];
		const yp = V[cy + k];
		const x = k !== D && xp < yp ? yp : xp + 1;
		const y = x - (k + Delta);
		console.debug({k, x, lj, y, rj});

		// Assert(x <= lj); // False sometimes
		assert(y <= rj);
		assert(x >= li);
		assert(y >= ri);
		V[center + k] = x;
	}

	console.debug('end forwardStep', {
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
