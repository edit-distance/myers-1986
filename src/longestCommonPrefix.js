import assert from 'assert';

/**
 * LongestCommonPrefix.
 *
 * @param {ArrayLike} a
 * @param {number} ai
 * @param {number} aj
 * @param {ArrayLike} b
 * @param {number} bi
 * @param {number} bj
 */
const longestCommonPrefix = (a, ai, aj, b, bi, bj) => {
	assert(ai >= 0 && aj <= a.length);
	assert(bi >= 0 && bj <= b.length);
	while (ai < aj && bi < bj && a[ai] === b[bi]) {
		++ai;
		++bi;
	}

	return ai;
};

export default longestCommonPrefix;
