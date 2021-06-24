import assert from 'assert';

import bound from './bound.js';
import longestCommonSuffix from './longestCommonSuffix.js';
/**
 * Diagonal backward extension.
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
export default function backwardExtend(
	center,
	D,
	V,
	eq,
	li,
	lj,
	ri,
	rj,
	Delta,
) {
	assert(ri > rj && li > lj);
	// NOTE: We make the bounding box as small as possible.
	// This should save roughly half of the computation time compared to
	// letting LB = -D and UB = D.
	const LB = -bound(D, li - lj);
	const UB = bound(D, ri - rj);
	assert(LB <= UB);
	assert(LB !== D);
	assert(UB !== -D);

	console.debug('beg backwardExtend', {
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

	const kMin = LB + Delta;
	const kMax = UB + Delta;
	const cx = center - Delta;
	const cMin = cx + kMin;
	const cMax = cx + kMax;
	for (let c = cMin; c <= cMax; c += 2) {
		const x = V[c];
		const y = x - (c - cx);
		console.debug({k: c - cx - Delta, x, lj, y, rj});
		assert(x === lj - 2 || x === lj - 1 || x >= lj); // These should be true
		assert(y === rj - 2 || y === rj - 1 || y >= rj); // Provided you called
		assert(x <= li); // BackwardStep(center, D, ...)
		assert(y <= ri); // Just before.
		V[c] = longestCommonSuffix(eq, x, lj, y, rj);
	}

	console.debug('end backwardExtend', {
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
