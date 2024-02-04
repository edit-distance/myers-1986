import assert from 'assert';

import longestCommonPrefix from './longestCommonPrefix.js';
import longestCommonSuffix from './longestCommonSuffix.js';

/**
 * MakeScan.
 *
 * @param {Function} method
 * @return {Function}
 */
export default function makeScan32(method) {
	/**
	 * Returns distance, or -1 if distance > MAX.
	 * Undefined behavior if indices are not int32.
	 *
	 * @param {number} MAX
	 * @param {Function} eq
	 * @param {number} li
	 * @param {number} lj
	 * @param {number} ri
	 * @param {number} rj
	 * @return {number}
	 */
	const scan32 = (MAX, eq, li, lj, ri, rj) => {
		assert(Number.isInteger(MAX));
		const N = (lj - li) | 0;
		const M = (rj - ri) | 0;
		assert(MAX <= N + M);

		if (MAX < 0) return -1;
		if (MAX === 0 && N !== M) return -1;

		const l0 = longestCommonPrefix(eq, li, lj, ri, rj);

		if (l0 === lj && N === M) return 0;

		if (MAX === 0) return -1;

		const r0 = (ri + ((l0 - li) | 0)) | 0;
		const l1 = longestCommonSuffix(eq, lj, l0, rj, r0);
		const r1 = (rj - ((lj - l1) | 0)) | 0;

		const halfPerimeter = (((l1 - l0) | 0) + ((r1 - r0) | 0)) | 0;

		return halfPerimeter <= MAX
			? l0 === l1 || r0 === r1
				? halfPerimeter
				: method(halfPerimeter, eq, l0, l1, r0, r1).distance
			: l0 === l1 || r0 === r1
				? -1
				: method(MAX, eq, l0, l1, r0, r1).distance;
	};

	return scan32;
}
