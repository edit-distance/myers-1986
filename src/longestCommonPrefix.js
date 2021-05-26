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
	while (ai < aj && bi < bj && eq(ai, bi)) {
		++ai;
		++bi;
	}

	return ai;
};

export default longestCommonPrefix;
