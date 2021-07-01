import assert from 'assert';

/**
 * Computes a lower bound for the signed distance.
 *
 * @see {@link uBound} for more details on usage and invariants.
 *
 * @param {number} D >= 1
 * @param {number} N >= 1
 * @return {number} A number -N <= k < D.
 */
export default function lBound(D, N) {
	assert(N >= 1);
	assert(D >= 1);
	const k = D <= N ? -D | 0 : (D - (N << 1)) | 0;
	assert(k >= -N);
	assert(k < D);
	assert((D & 1) === (k & 1));
	return k;
}
