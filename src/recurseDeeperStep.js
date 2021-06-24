import assert from 'assert';

import StackEntry from './StackEntry.js';
import twoWayRealloc from './twoWayRealloc.js';
import twoWayScan from './twoWayScan.js';

/**
 * RecurseDeeper.
 *
 * /!\ The entries in this stack should have a value D = MAX that is exactly
 * the distance on the input range [li, lj, ri, rj].
 *
 * @param {Int32Array} V
 * @param {StackEntry[]} stack
 * @param {Function} eq
 * @return {number[]}
 */
const recurseDeeperStep = (V, stack, eq) => {
	assert(stack.length > 0);
	const entry = stack.pop();
	assert(entry instanceof StackEntry);
	let MAX = entry.D;
	const li = entry.li;
	let lj = entry.lj;
	const ri = entry.ri;
	let rj = entry.rj;
	// eslint-disable-next-line no-constant-condition
	while (true) {
		assert(MAX >= 1);
		const halfPerimeter = lj - li + rj - ri;
		assert(halfPerimeter >= MAX);
		if (halfPerimeter === MAX) {
			assert(li < lj || ri < rj);
			assert(lj - li <= MAX && rj - ri <= MAX);
			return [li, lj, ri, rj];
		}

		assert(halfPerimeter > MAX);
		assert(li < lj);
		assert(ri < rj);
		assert(!eq(li, ri));
		assert(!eq(lj - 1, rj - 1));

		const {centerF, centerB} = twoWayRealloc(V, MAX, li, lj, ri, rj);

		const split = twoWayScan(MAX, V, centerF, centerB, eq, li, lj, ri, rj);

		const k = split.k;
		const xBegin = split.xBegin;
		const xEnd = split.xEnd;
		const distanceLeft = split.distanceLeft;
		const distance = split.distance;
		assert(distance === MAX);
		const distanceRight = MAX - distanceLeft;

		console.debug({k, xBegin, xEnd, distance});

		const maxDistance = halfPerimeter - 2 * (xEnd - xBegin);
		assert(distance <= maxDistance);
		assert(distance < maxDistance || xBegin < xEnd);
		// We push the right side of the recursion tree on the stack
		stack.push(new StackEntry(distanceRight, xEnd, lj, xEnd - k, rj));
		// Explicit tail recursion on the left side of the recursion tree
		MAX = distanceLeft;
		lj = xBegin;
		rj = xBegin - k;
	}
};

export default recurseDeeperStep;
