import assert from 'assert';

/**
 * LongestCommonPrefix.
 *
 * @param {Function} eq
 * @param {number} ai
 * @param {number} aj
 * @param {number} bi
 * @param {number} bj
 */
export default function longestCommonPrefix(eq, ai, aj, bi, bj) {
	assert(Number.isInteger(ai) && ai >= 0);
	assert(Number.isInteger(aj));
	assert(Number.isInteger(bi) && bi >= 0);
	assert(Number.isInteger(bj));
	// Assert(ai <= aj && bi <= bj); // Broken to avoid branchy hot-loops
	if (((aj - ai) | 0) <= ((bj - bi) | 0)) {
		while (ai < aj && eq(ai, bi)) {
			ai = (ai + 1) | 0;
			bi = (bi + 1) | 0;
		}
	} else {
		while (bi < bj && eq(ai, bi)) {
			ai = (ai + 1) | 0;
			bi = (bi + 1) | 0;
		}
	}

	return ai;
}
