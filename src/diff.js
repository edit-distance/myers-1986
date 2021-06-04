import assert from 'assert';

import {ValueError} from '@failure-abstraction/error';

import longestCommonPrefix from './longestCommonPrefix.js';
import longestCommonSuffix from './longestCommonSuffix.js';
import twoWayAlloc from './twoWayAlloc.js';
import twoWayRealloc from './twoWayRealloc.js';
import twoWayScan from './twoWayScan.js';

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

/**
 * StackEntry.
 *
 * @param {number} D
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 */
function StackEntry(D, li, lj, ri, rj) {
	this.D = D;
	this.li = li;
	this.lj = lj;
	this.ri = ri;
	this.rj = rj;
}

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
function* recurse(MAX, eq, li, lj, ri, rj) {
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

	const {k, xBegin, xEnd, distance, distanceLeft, distanceRight} = twoWayScan(
		MAX,
		V,
		centerF,
		centerB,
		eq,
		li,
		lj,
		ri,
		rj,
	);

	console.debug({k, xBegin, xEnd, distance});

	if (distance === -1) throw new ValueError();

	assert(distance > 0);
	const maxDistance = lj - li + (rj - ri) - 2 * (xEnd - xBegin);
	if (distance === maxDistance) {
		// Early exit when there is no match in the recursive calls
		assert(xBegin < xEnd);
		yield [li, xBegin, ri, xBegin - k];
		yield [xEnd, lj, xEnd - k, rj];
	} else {
		assert(distance < maxDistance);
		yield* recurseDeeper(
			V,
			[
				new StackEntry(distanceRight, xEnd, lj, xEnd - k, rj),
				new StackEntry(distanceLeft, li, xBegin, ri, xBegin - k),
			],
			eq,
		);
	}
}

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
function* recurseDeep(MAX, eq, li, lj, ri, rj) {
	assert(MAX >= 1);
	assert(lj - li + rj - ri >= MAX);
	if (li === lj || ri === rj) {
		assert(li < lj || ri < rj);
		assert(lj - li <= MAX && rj - ri <= MAX);
		yield [li, lj, ri, rj];
		return;
	}

	assert(li < lj);
	assert(ri < rj);
	assert(!eq(li, ri));
	assert(!eq(lj - 1, rj - 1));

	const {V, centerF, centerB} = twoWayAlloc(MAX, li, lj, ri, rj);

	const {k, xBegin, xEnd, distance, distanceLeft, distanceRight} = twoWayScan(
		MAX,
		V,
		centerF,
		centerB,
		eq,
		li,
		lj,
		ri,
		rj,
	);

	console.debug({k, xBegin, xEnd, distance});

	assert(distance > 0);
	const maxDistance = lj - li + (rj - ri) - 2 * (xEnd - xBegin);
	if (distance === maxDistance) {
		// Early exit when there is no match in the recursive calls
		if (xBegin === xEnd) {
			yield [li, lj, ri, rj];
		} else {
			yield [li, xBegin, ri, xBegin - k];
			yield [xEnd, lj, xEnd - k, rj];
		}
	} else {
		assert(distance < maxDistance);
		yield* recurseDeeper(
			V,
			[
				new StackEntry(distanceRight, xEnd, lj, xEnd - k, rj),
				new StackEntry(distanceLeft, li, xBegin, ri, xBegin - k),
			],
			eq,
		);
	}
}

/**
 * RecurseDeeper.
 *
 * @param {Int32Array} V
 * @param {StackEntry[]} stack
 * @param {Function} eq
 * @return {IterableIterator}
 */
function* recurseDeeper(V, stack, eq) {
	while (stack.length > 0) {
		const entry = stack.pop();
		const MAX = entry.D;
		const li = entry.li;
		const lj = entry.lj;
		const ri = entry.ri;
		const rj = entry.rj;

		assert(MAX >= 1);
		assert(lj - li + rj - ri >= MAX);
		if (li === lj || ri === rj) {
			assert(li < lj || ri < rj);
			assert(lj - li <= MAX && rj - ri <= MAX);
			yield [li, lj, ri, rj];
			continue;
		}

		assert(li < lj);
		assert(ri < rj);
		assert(!eq(li, ri));
		assert(!eq(lj - 1, rj - 1));

		const {centerF, centerB} = twoWayRealloc(V, MAX, li, lj, ri, rj);

		const {k, xBegin, xEnd, distance, distanceLeft, distanceRight} = twoWayScan(
			MAX,
			V,
			centerF,
			centerB,
			eq,
			li,
			lj,
			ri,
			rj,
		);

		console.debug({k, xBegin, xEnd, distance});

		assert(distance > 0);
		const maxDistance = lj - li + (rj - ri) - 2 * (xEnd - xBegin);
		if (distance === maxDistance) {
			// Early exit when there is no match in the recursive calls
			if (xBegin === xEnd) {
				yield [li, lj, ri, rj];
			} else {
				yield [li, xBegin, ri, xBegin - k];
				yield [xEnd, lj, xEnd - k, rj];
			}
		} else {
			assert(distance < maxDistance);
			stack.push(
				new StackEntry(distanceRight, xEnd, lj, xEnd - k, rj),
				new StackEntry(distanceLeft, li, xBegin, ri, xBegin - k),
			);
		}
	}
}
