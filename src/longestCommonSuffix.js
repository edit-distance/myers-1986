import assert from 'assert';

/**
 * LongestCommonSuffix.
 *
 * @param {Function} eq
 * @param {number} aj
 * @param {number} ai
 * @param {number} bj
 * @param {number} bi
 */
export default function longestCommonSuffix(eq, aj, ai, bj, bi) {
	assert(Number.isInteger(aj));
	assert(Number.isInteger(ai) && ai >= 0);
	assert(Number.isInteger(bj));
	assert(Number.isInteger(bi) && bi >= 0);
	// Assert(ai <= aj && bi <= bj); Broken to avoid branchy hot-loops
	if (((aj - ai) | 0) <= ((bj - bi) | 0)) {
		while (ai < aj && eq((aj - 1) | 0, (bj - 1) | 0)) {
			aj = (aj - 1) | 0;
			bj = (bj - 1) | 0;
		}
	} else {
		while (bi < bj && eq((aj - 1) | 0, (bj - 1) | 0)) {
			aj = (aj - 1) | 0;
			bj = (bj - 1) | 0;
		}
	}

	return aj;
}
