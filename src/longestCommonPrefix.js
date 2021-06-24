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
const longestCommonPrefix = (eq, ai, aj, bi, bj) => {
	assert(Number.isInteger(ai) && ai >= 0);
	assert(Number.isInteger(aj));
	assert(Number.isInteger(bi) && bi >= 0);
	assert(Number.isInteger(bj));
	// Assert(ai <= aj && bi <= bj); // Broken to avoid branchy hot-loops
	if (aj - ai <= bj - bi) {
		while (ai < aj && eq(ai, bi)) {
			++ai;
			++bi;
		}
	} else {
		while (bi < bj && eq(ai, bi)) {
			++ai;
			++bi;
		}
	}

	return ai;
};

export default longestCommonPrefix;
