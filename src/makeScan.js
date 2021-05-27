import assert from 'assert';

import longestCommonPrefix from './longestCommonPrefix.js';
import makeEqualityFn from './makeEqualityFn.js';
import defaultTest from './defaultTest.js';

/**
 * MakeScan.
 *
 * @param {Function} method
 * @return {Function}
 */
const makeScan = (method) => {
	/**
	 * Scan.
	 *
	 * @param {number} MAX
	 * @param {ArrayLike} left
	 * @param {number} li
	 * @param {number} lj
	 * @param {ArrayLike} right
	 * @param {number} ri
	 * @param {number} rj
	 * @param {Function} [test=defaultTest]
	 * @return {number}
	 */
	const scan = (MAX, left, li, lj, right, ri, rj, test = defaultTest) => {
		assert(Number.isInteger(MAX));
		const N = lj - li;
		const M = rj - ri;
		assert(MAX <= N + M);

		if (MAX < 0) return -1;

		const eq = makeEqualityFn(test, left, right);

		if (MAX === 0)
			return M === N && longestCommonPrefix(eq, li, lj, ri, rj) === lj ? 0 : -1;

		return method(MAX, eq, li, lj, ri, rj);
	};

	return scan;
};

export default makeScan;
