import test from 'ava';

import {ValueError} from '@failure-abstraction/error';

import {makeEqualityFn, defaultTest} from '../../src/index.js';

import {
	data,
	benchmarkInputs,
	diffAlgorithms,
	distance,
	repr,
	inflate,
	ensureDistance,
	addDefaultBounds,
	tweakBounds,
	addPadding,
	ensureMAX,
	tweakMAX,
	swapInputs,
	listifyStringInputs,
	simplify,
	// SimplifyEditScript,
	applyPatch,
	calcPatch,
	swapEditScript,
} from './_fixtures.js';

const macro = (t, algorithm, MAX, left, li, lj, right, ri, rj, expected) => {
	const eq = makeEqualityFn(defaultTest, left, right);

	if (expected === -1) {
		t.throws(() => Array.from(algorithm(MAX, eq, li, lj, ri, rj)), {
			instanceOf: ValueError,
		});
	} else {
		const result = Array.from(algorithm(MAX, eq, li, lj, ri, rj));
		const a = applyPatch(calcPatch(result, right), left, li, lj);
		const b = applyPatch(
			calcPatch(swapEditScript(result), left),
			right,
			ri,
			rj,
		);
		t.deepEqual(a, right.slice(ri, rj));
		t.deepEqual(b, left.slice(li, lj));
		t.is(distance(result), expected);
		// We do not normalize output (yet)
		// Const simplified = simplifyEditScript(result);
		// t.deepEqual(result, simplified);
	}
};

macro.title = (title, algorithm, MAX, left, li, lj, right, ri, rj, expected) =>
	title ??
	`${algorithm.name}(${MAX}, ${repr(left)}[${li}:${lj}], ${repr(
		right,
	)}[${ri}:${rj}]) ${
		expected === undefined ? 'throws ValueError' : `is ${expected}`
	}`;

const value = (x) => JSON.stringify(x);
const props = ({algorithm, ...args}) => ({algorithm: algorithm.name, ...args});
const item = (x) => value(props(x));
const done = new Set();
const add = (x) => done.add(item(x));
const has = (x) => done.has(item(x));

const _test = (algorithm, MAX, left, li, lj, right, ri, rj, distance) => {
	const key = {algorithm, MAX, left, li, lj, right, ri, rj};
	if (!has(key)) {
		add(key);
		test(macro, algorithm, MAX, left, li, lj, right, ri, rj, distance);
	}
};

const inputs = (iterable) =>
	inflate(iterable, [
		ensureDistance,
		addDefaultBounds,
		tweakBounds,
		addPadding,
		ensureMAX,
		tweakMAX,
		swapInputs,
		listifyStringInputs,
		simplify,
	]);

const rawInputs = (iterable) =>
	inflate(iterable, [addDefaultBounds, ensureMAX]);

for (const algorithm of diffAlgorithms) {
	for (const {MAX, left, li, lj, right, ri, rj, distance: expected} of inputs(
		data,
	)) {
		_test(algorithm, MAX, left, li, lj, right, ri, rj, expected);
	}

	for (const {
		MAX,
		left,
		li,
		lj,
		right,
		ri,
		rj,
		distance: expected,
	} of rawInputs(benchmarkInputs)) {
		_test(algorithm, MAX, left, li, lj, right, ri, rj, expected);
	}
}
