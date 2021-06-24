import assert from 'assert';

import {ValueError} from '@failure-abstraction/error';

import twoWayAlloc from './twoWayAlloc.js';
import twoWayScan from './twoWayScan.js';

import RecurseDeeper from './RecurseDeeper.js';
import StackEntry from './StackEntry.js';

/**
 * Recurse.
 *
 * @param {number} MAX
 * @param {Function} eq
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @return {IterableIterator}
 */
const recurse = (MAX, eq, li, lj, ri, rj) => {
	assert(MAX >= 0);
	assert(lj - li + rj - ri > MAX);
	if (li === lj || ri === rj) {
		assert(lj - li > MAX || rj - ri > MAX);
		throw new ValueError();
	}

	assert(li < lj);
	assert(ri < rj);
	assert(!eq(li, ri));
	assert(!eq(lj - 1, rj - 1));

	const {V, centerF, centerB} = twoWayAlloc(MAX, li, lj, ri, rj);

	const split = twoWayScan(MAX, V, centerF, centerB, eq, li, lj, ri, rj);

	const k = split.k;
	const xBegin = split.xBegin;
	const xEnd = split.xEnd;
	const distanceLeft = split.distanceLeft;
	const distance = split.distance;
	const distanceRight = distance - distanceLeft;

	console.debug({k, xBegin, xEnd, distance});

	if (distance === -1) throw new ValueError();

	assert(distance > 0);
	const maxDistance = lj - li + (rj - ri) - 2 * (xEnd - xBegin);
	if (distance === maxDistance) {
		// Early exit when there is no match in the recursive calls
		assert(xBegin < xEnd);
		return [
			[li, xBegin, ri, xBegin - k],
			[xEnd, lj, xEnd - k, rj],
		][Symbol.iterator]();
	}

	assert(distance < maxDistance);
	return new RecurseDeeper(
		V,
		[
			new StackEntry(distanceRight, xEnd, lj, xEnd - k, rj),
			new StackEntry(distanceLeft, li, xBegin, ri, xBegin - k),
		],
		eq,
	);
};

export default recurse;
