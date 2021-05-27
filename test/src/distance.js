import test from 'ava';

import {
	data,
	algorithms,
	repr,
	inflate,
	ensureDistance,
	addDefaultBounds,
	tweakBounds,
	addPadding,
	tweakMAX,
	swapInputs,
	listifyStringInputs,
} from './_fixtures.js';

const macro = (t, algorithm, MAX, left, li, lj, right, ri, rj, expected) => {
	const result = algorithm(MAX, left, li, lj, right, ri, rj);
	t.is(result, expected);
};

macro.title = (title, algorithm, MAX, left, li, lj, right, ri, rj, expected) =>
	title ??
	`[${algorithm.name}] distance(${MAX}, ${repr(left)}[${li}:${lj}], ${repr(
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
		tweakMAX,
		swapInputs,
		listifyStringInputs,
	]);

for (const algorithm of algorithms) {
	for (const {MAX, left, li, lj, right, ri, rj, distance: expected} of inputs(
		data,
	)) {
		_test(algorithm, MAX, left, li, lj, right, ri, rj, expected);
	}
}
