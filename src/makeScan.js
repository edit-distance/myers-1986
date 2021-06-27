import assert from 'assert';

import longestCommonPrefix from './longestCommonPrefix.js';
import longestCommonSuffix from './longestCommonSuffix.js';
import makeEqualityFn from './makeEqualityFn.js';
import defaultTest from './defaultTest.js';

/**
 * MakeScan.
 *
 * @param {Function} method
 * @return {Function}
 */
export default function makeScan(method) {
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
		if (MAX === 0 && N !== M) return -1;

		const eq = makeEqualityFn(test, left, right);

		const l0 = longestCommonPrefix(eq, li, lj, ri, rj);

		if (l0 === lj && N === M) return 0;

		if (MAX === 0) return -1;

		const r0 = ri + (l0 - li);
		const l1 = longestCommonSuffix(eq, lj, l0, rj, r0);
		const r1 = rj - (lj - l1);

		const halfPerimeter = l1 - l0 + r1 - r0;

		return halfPerimeter <= MAX
			? l0 === l1 || r0 === r1
				? halfPerimeter
				: method(halfPerimeter, eq, l0, l1, r0, r1).distance
			: l0 === l1 || r0 === r1
			? -1
			: method(MAX, eq, l0, l1, r0, r1).distance;
	};

	return scan;
}
