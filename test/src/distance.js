import test from 'ava';

import {makeEqualityFn, defaultTest} from '../../src/index.js';

import {
	data,
	benchmarkInputs,
	distanceAlgorithms,
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
} from './_fixtures.js';

const macro = (t, algorithm, MAX, left, li, lj, right, ri, rj, expected) => {
	const eq = makeEqualityFn(defaultTest, left, right);
	const result = algorithm(MAX, eq, li, lj, ri, rj);
	t.is(result, expected);
};

macro.title = (title, algorithm, MAX, left, li, lj, right, ri, rj, expected) =>
	title ??
	`${algorithm.name}(${MAX}, ${repr(left)}[${li}:${lj}], ${repr(
		right,
	)}[${ri}:${rj}]) is ${expected}`;

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
	]);

const rawInputs = (iterable) =>
	inflate(iterable, [addDefaultBounds, ensureMAX]);

for (const algorithm of distanceAlgorithms) {
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
