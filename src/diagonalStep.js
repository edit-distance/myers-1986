import assert from 'assert';

/**
 * Diagonal step.
 *
 * @param {number} direction
 * @param {Function} longestCommonPrefix
 * @param {number} center
 * @param {number} D
 * @param {Int32Array} V
 * @param {ArrayLike} left
 * @param {number} lj
 * @param {ArrayLike} right
 * @param {number} rj
 * @return {IterableIterator}
 */
export default function* diagonalStep(
	direction,
	longestCommonPrefix,
	center,
	D,
	V,
	left,
	li,
	lj,
	right,
	ri,
	rj,
	Delta,
) {
	assert(direction === -1 || ri < rj || li < lj);
	assert(direction === 1 || ri > rj || li > lj);
	const LB = -bound(D, direction === 1 ? rj - ri : li - lj);
	const UB = bound(D, direction === 1 ? lj - li : ri - rj);
	console.debug('beg diagonalStep', {
		direction,
		longestCommonPrefix,
		center,
		D,
		V,
		left,
		li,
		lj,
		right,
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
		if (direction === 1 && (x > lj || y > rj || x < li || y < ri)) continue;
		if (direction === -1 && (x < lj || y < rj || x > li || y > ri)) continue;
		const s = longestCommonPrefix(left, x, lj, right, y, rj);
		assert(direction === -1 || (s >= x && s <= lj));
		assert(direction === 1 || (s >= lj && s <= x));
		V[center + k] = s;
		yield k;
	}

	console.debug('end diagonalStep', {
		direction,
		longestCommonPrefix,
		center,
		D,
		V,
		left,
		li,
		lj,
		right,
		ri,
		rj,
		Delta,
	});
}

const bound = (D, N) => (D <= N ? D : 2 * N - D);
