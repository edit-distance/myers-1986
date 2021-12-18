import assert from 'assert';

import {ValueError} from '@failure-abstraction/error';

import longestCommonPrefix from './longestCommonPrefix.js';
import longestCommonSuffix from './longestCommonSuffix.js';

import recurse from './recurse.js';
import recurseDeep from './recurseDeep.js';

/**
 * Yields diff rectangles.
 * Undefined behavior if indices are not int32.
 *
 * @param {number} MAX
 * @param {Function} eq
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @return {IterableIterator}
 */
export default function diff32(MAX, eq, li, lj, ri, rj) {
	assert(
		Number.isInteger(MAX) && MAX >= -2_147_483_648 && MAX <= 2_147_483_647,
	);
	assert(Number.isInteger(li) && li >= -2_147_483_648 && li <= 2_147_483_647);
	assert(Number.isInteger(lj) && lj >= -2_147_483_648 && lj <= 2_147_483_647);
	assert(Number.isInteger(ri) && ri >= -2_147_483_648 && ri <= 2_147_483_647);
	assert(Number.isInteger(rj) && rj >= -2_147_483_648 && rj <= 2_147_483_647);
	const N = (lj - li) | 0;
	const M = (rj - ri) | 0;
	assert(MAX <= N + M);

	if (MAX < 0) throw new ValueError();

	if (MAX === 0 && N !== M) throw new ValueError();

	const l0 = longestCommonPrefix(eq, li, lj, ri, rj);

	if (l0 === lj && N === M) return [][Symbol.iterator]();

	if (MAX === 0) throw new ValueError();

	const r0 = (ri + ((l0 - li) | 0)) | 0;
	const l1 = longestCommonSuffix(eq, lj, l0, rj, r0);
	const r1 = (rj - ((lj - l1) | 0)) | 0;

	assert(l0 < l1 || r0 < r1);

	return MAX < ((((l1 - l0) | 0) + ((r1 - r0) | 0)) | 0)
		? recurse(MAX, eq, l0, l1, r0, r1)
		: recurseDeep((((l1 - l0) | 0) + ((r1 - r0) | 0)) | 0, eq, l0, l1, r0, r1);
}
