import assert from 'assert';

/**
 * LongestCommonSuffix.
 *
 * @param {ArrayLike} a
 * @param {number} aj
 * @param {number} ai
 * @param {ArrayLike} b
 * @param {number} bj
 * @param {number} bi
 */
const longestCommonSuffix = (a, aj, ai, b, bj, bi) => {
	assert(ai >= 0 && aj <= a.length);
	assert(bi >= 0 && bj <= b.length);
	while (ai < aj && bi < bj && a[aj - 1] === b[bj - 1]) {
		--aj;
		--bj;
	}

	return aj;
};

export default longestCommonSuffix;
