import assert from 'assert';

import {ValueError} from '@failure-abstraction/error';

import longestCommonPrefix from './longestCommonPrefix.js';
import longestCommonSuffix from './longestCommonSuffix.js';

import recurse from './recurse.js';
import recurseDeep from './recurseDeep.js';

/**
 * Yields diff rectangles.
 *
 * @param {number} MAX
 * @param {Function} eq
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @return {IterableIterator}
 */
const diff = (MAX, eq, li, lj, ri, rj) => {
	assert(Number.isInteger(MAX));
	const N = lj - li;
	const M = rj - ri;
	assert(MAX <= N + M);

	if (MAX < 0) throw new ValueError();

	if (MAX === 0 && N !== M) throw new ValueError();

	const l0 = longestCommonPrefix(eq, li, lj, ri, rj);

	if (l0 === lj && N === M) return [][Symbol.iterator]();

	if (MAX === 0) throw new ValueError();

	const r0 = ri + (l0 - li);
	const l1 = longestCommonSuffix(eq, lj, l0, rj, r0);
	const r1 = rj - (lj - l1);

	assert(l0 < l1 || r0 < r1);

	return MAX < l1 - l0 + r1 - r0
		? recurse(MAX, eq, l0, l1, r0, r1)
		: recurseDeep(l1 - l0 + r1 - r0, eq, l0, l1, r0, r1);
};

export default diff;
