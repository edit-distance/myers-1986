import assert from 'assert';

/**
 * MakeEqualityFn.
 *
 * @param {Function} test
 * @param {ArrayLike} left
 * @param {ArrayLike} right
 */
export default function makeEqualityFn(test, left, right) {
	/**
	 * Eq.
	 *
	 * @param {number} i
	 * @param {number} j
	 * @return {boolean}
	 */
	const eq = (i, j) => {
		assert(i >= 0 && i < left.length);
		assert(j >= 0 && j < right.length);
		return test(left[i], right[j]);
	};

	return eq;
}
