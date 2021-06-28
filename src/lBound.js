import assert from 'assert';

/**
 * Computes a lower bound for the signed distance.
 *
 * @param {number} D >= 1
 * @param {number} N >= 1
 * @return {number} A number -N <= k < D.
 */
export default function lBound(D, N) {
	assert(N >= 1);
	assert(D >= 1);
	const k = D <= N ? -D : D - (N << 1);
	assert(k >= -N);
	assert(k < D);
	assert((D & 1) === (k & 1));
	return k;
}
