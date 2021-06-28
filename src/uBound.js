import assert from 'assert';

/**
 * Computes an upper bound for the signed distance.
 *
 * @param {number} D >= 1
 * @param {number} N >= 1
 * @return {number} A number -D < k <= N.
 */
export default function uBound(D, N) {
	assert(N >= 1);
	assert(D >= 1);
	const k = D <= N ? D | 0 : ((N << 1) - D) | 0;
	assert(k <= N);
	assert(k > -D);
	assert((D & 1) === (k & 1));
	return k;
}
