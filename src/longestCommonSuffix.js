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
	assert(ai <= aj && bi <= bj);
	while (ai < aj && bi < bj && eq(aj - 1, bj - 1)) {
		--aj;
		--bj;
	}

	return aj;
};

export default longestCommonSuffix;
