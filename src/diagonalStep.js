import assert from 'assert';

import bound from './bound.js';

/**
 * Diagonal step.
 *
 * @param {number} direction
 * @param {Function} longestCommonPrefix
 * @param {number} center
 * @param {number} D
 * @param {Int32Array} V
 * @param {Function} eq
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @param {number} Delta
 * @return {IterableIterator}
 */
export default function* diagonalStep(
	direction,
	longestCommonPrefix,
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
	assert(direction === 1 || direction === -1);
	assert(direction === -1 || ri < rj || li < lj);
	assert(direction === 1 || ri > rj || li > lj);
	// NOTE: We make the bounding box as small as possible.
	// This should save roughly half of the computation time compared to
	// letting LB = -D and UB = D.
	const LB = -bound(D, direction === 1 ? rj - ri : li - lj);
	const UB = bound(D, direction === 1 ? lj - li : ri - rj);
	console.debug('beg diagonalStep', {
		direction,
		longestCommonPrefix,
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
	for (let k = LB; k <= UB; k += 2) {
		const x =
			k === -direction * D ||
			(k !== direction * D &&
				direction * V[center + k - direction] <
					direction * V[center + k + direction])
				? V[center + k + direction]
				: V[center + k - direction] + direction;
		const y = x - (k + Delta);
		console.debug({k, x, lj, y, rj});
		if (direction === 1) {
			if (x > lj || y > rj || x < li || y < ri) continue;
		} else if (x < lj || y < rj || x > li || y > ri) continue;
		V[center + k] = longestCommonPrefix(eq, x, lj, y, rj);
		yield k;
	}

	console.debug('end diagonalStep', {
		direction,
		longestCommonPrefix,
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
