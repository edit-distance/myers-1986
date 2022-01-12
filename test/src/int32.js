import test from 'ava';

import {
	TypeError,
	repr,
	diffAlgorithms,
	distanceAlgorithms,
} from './_fixtures.js';

const macro = (t, algorithm, MAX, eq, li, lj, ri, rj, instanceOf) => {
	t.throws(() => algorithm(MAX, eq, li, lj, ri, rj), {
		instanceOf,
	});
};

macro.title = (title, algorithm, MAX, eq, li, lj, ri, rj, instanceOf) =>
	title ??
	`${algorithm.name}(${repr(MAX)}, ${eq.name}, ${repr(li)}, ${repr(lj)}, ${repr(
		ri,
	)}, ${repr(rj)}) throws ${instanceOf.name}`;

const algorithms = [...distanceAlgorithms, ...diffAlgorithms];
const eq = (i, j) => i === j;

/**
 * All kinds of inputs that make int32 coercion fail.
 */
const inputs = [
	[-1, eq, 0, 0, 0, 0n, TypeError],
	[-1, eq, 0, 0, 0n, 0, TypeError],
	[-1, eq, 0, 0n, 0, 0, TypeError],
	[-1, eq, 0n, 0, 0, 0, TypeError],
	[-1n, eq, 0, 0, 0, 0, TypeError],
	[100, eq, 0, 2 ** 30, 0, 2 ** 31, TypeError],
	[100, eq, 2 ** 30, 2 ** 32, 0, 10, TypeError],
	[100, eq, -(2 ** 31 + 1), 0, 0, 10, TypeError],
];

for (const algorithm of algorithms) {
	for (const input of inputs) {
		test(macro, algorithm, ...input);
	}
}
