import assert from 'assert';

import {ValueError} from '@failure-abstraction/error';

import longestCommonPrefix from './longestCommonPrefix.js';
import longestCommonSuffix from './longestCommonSuffix.js';
import twoWay from './twoWay.js';

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

	return recurse(Math.min(MAX, l1 - l0 + r1 - r0), eq, l0, l1, r0, r1);
};

export default diff;

function* recurse(MAX, eq, li, lj, ri, rj) {
	if (li === lj) {
		if (ri === rj) return;
		if (rj - ri > MAX) throw new ValueError();
		yield [li, li, ri, rj];
		return;
	}

	if (ri === rj) {
		if (lj - li > MAX) throw new ValueError();
		yield [li, lj, ri, ri];
		return;
	}

	assert(li < lj);
	assert(ri < rj);
	assert(!eq(li, ri));
	assert(!eq(lj - 1, rj - 1));

	const {k, xBegin, xEnd, distance, distanceLeft, distanceRight} = twoWay(
		MAX,
		eq,
		li,
		lj,
		ri,
		rj,
	);

	if (distance === -1) throw new ValueError();

	console.debug({k, xBegin, xEnd, distance});

	yield* recurse(distanceLeft, eq, li, xBegin, ri, xBegin - k);

	yield* recurse(distanceRight, eq, xEnd, lj, xEnd - k, rj);
}
