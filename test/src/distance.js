import test from 'ava';

import {data, algorithms, repr} from './_fixtures.js';

const macro = (t, algorithm, MAX, left, right, expected) => {
	const result = algorithm(MAX, left, right);
	t.is(result, expected);
};

macro.title = (title, algorithm, MAX, left, right, expected) =>
	title ??
	`[${algorithm.name}] distance(${MAX}, ${repr(left)}, ${repr(
		right,
	)}) is ${expected}`;

const value = (x) => JSON.stringify(x);
const props = ({algorithm, ...args}) => ({algorithm: algorithm.name, ...args});
const item = (x) => value(props(x));
const done = new Set();
const add = (x) => done.add(item(x));
const has = (x) => done.has(item(x));

const _test = (algorithm, MAX, left, right, distance) => {
	const key = {algorithm, MAX, left, right};
	if (!has(key)) {
		add(key);
		test(macro, algorithm, MAX, left, right, distance);
	}
};

const inputs = function* ({left, right, distance}) {
	yield {
		MAX: left.length + right.length,
		left,
		right,
		expected: distance,
	};

	yield {
		MAX: distance,
		left,
		right,
		expected: distance,
	};

	yield {
		MAX: distance - 1,
		left,
		right,
		expected: -1,
	};

	yield {
		MAX: 0,
		left,
		right,
		expected: left === right ? 0 : -1,
	};
};

for (const algorithm of algorithms) {
	for (const entry of data) {
		for (const {MAX, left, right, expected} of inputs(entry)) {
			_test(algorithm, MAX, left, right, expected);
			_test(algorithm, MAX, right, left, expected);
		}
	}
}
