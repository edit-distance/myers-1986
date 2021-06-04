import assert from 'assert';

/**
 * Bound.
 *
 * @param {number} D >= 1
 * @param {number} N >= 1
 * @return {number} A number -D < k <= N.
 */
const bound = (D, N) => {
	assert(N >= 1);
	assert(D >= 1);
	const k = D <= N ? D : 2 * N - D;
	assert(k <= N);
	assert(k > -D);
	assert((D & 1) === (k & 1));
	return k;
};

export default bound;
