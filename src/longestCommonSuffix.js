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
const longestCommonSuffix = (eq, aj, ai, bj, bi) => {
	assert(Number.isInteger(aj));
	assert(Number.isInteger(ai) && ai >= 0);
	assert(Number.isInteger(bj));
	assert(Number.isInteger(bi) && bi >= 0);
	// Assert(ai <= aj && bi <= bj); Broken to avoid branchy hot-loops
	if (aj - ai <= bj - bi) {
		while (ai < aj && eq(aj - 1, bj - 1)) {
			--aj;
			--bj;
		}
	} else {
		while (bi < bj && eq(aj - 1, bj - 1)) {
			--aj;
			--bj;
		}
	}

	return aj;
};

export default longestCommonSuffix;
