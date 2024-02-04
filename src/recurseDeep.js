import assert from 'assert';

import twoWayAlloc from './twoWayAlloc.js';
import twoWayScan from './twoWayScan.js';
import RecurseDeeper from './RecurseDeeper.js';
import StackEntry from './StackEntry.js';

/**
 * RecurseDeep.
 *
 * @param {number} MAX
 * @param {Function} eq
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @return {IterableIterator}
 */
export default function recurseDeep(MAX, eq, li, lj, ri, rj) {
	assert(MAX >= 1);
	assert(lj - li + rj - ri >= MAX);
	if (li === lj || ri === rj) {
		assert(li < lj || ri < rj);
		assert(lj - li <= MAX && rj - ri <= MAX);
		return [[li, lj, ri, rj]][Symbol.iterator]();
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
	const distanceRight = (distance - distanceLeft) | 0;

	console.debug({k, xBegin, xEnd, distance});

	assert(distance > 0);
	const maxDistance =
		(((lj - li) | 0) + ((((rj - ri) | 0) - ((xEnd - xBegin) << 1)) | 0)) | 0;
	if (distance === maxDistance) {
		// Early exit when there is no match in the recursive calls
		if (xBegin === xEnd) {
			return [[li, lj, ri, rj]][Symbol.iterator]();
		}

		return [
			[li, xBegin, ri, (xBegin - k) | 0],
			[xEnd, lj, (xEnd - k) | 0, rj],
		][Symbol.iterator]();
	}

	assert(distance < maxDistance);
	return new RecurseDeeper(
		V,
		[
			new StackEntry(distanceRight, xEnd, lj, (xEnd - k) | 0, rj),
			new StackEntry(distanceLeft, li, xBegin, ri, (xBegin - k) | 0),
		],
		eq,
	);
}
