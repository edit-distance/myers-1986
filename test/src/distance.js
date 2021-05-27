import test from 'ava';

import {list} from '@iterable-iterator/list';

import {
	data,
	algorithms,
	repr,
	arrayLikeIsEqual,
	longestCommonPrefixLength,
	longestCommonSuffixLength,
	concat,
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

const inputs = function* ({left, right, distance}) {
	yield {
		MAX: left.length + right.length,
		left,
		li: 0,
		lj: left.length,
		right,
		ri: 0,
		rj: right.length,
		expected: distance,
	};

	yield {
		MAX: distance,
		left,
		li: 0,
		lj: left.length,
		right,
		ri: 0,
		rj: right.length,
		expected: distance,
	};

	yield {
		MAX: distance - 1,
		left,
		li: 0,
		lj: left.length,
		right,
		ri: 0,
		rj: right.length,
		expected: -1,
	};

	yield {
		MAX: 0,
		left,
		li: 0,
		lj: left.length,
		right,
		ri: 0,
		rj: right.length,
		expected: arrayLikeIsEqual(left, 0, left.length, right, 0, right.length)
			? 0
			: -1,
	};

	const pn = longestCommonPrefixLength(
		left,
		0,
		left.length,
		right,
		0,
		right.length,
	);

	yield {
		MAX: distance,
		left,
		li: pn,
		lj: left.length,
		right,
		ri: pn,
		rj: right.length,
		expected: distance,
	};

	const sn = longestCommonSuffixLength(
		left,
		0,
		left.length,
		right,
		0,
		right.length,
	);

	yield {
		MAX: distance,
		left,
		li: 0,
		lj: left.length - sn,
		right,
		ri: 0,
		rj: right.length - sn,
		expected: distance,
	};

	const sn2 = longestCommonSuffixLength(
		left,
		pn,
		left.length,
		right,
		pn,
		right.length,
	);

	yield {
		MAX: distance,
		left,
		li: pn,
		lj: left.length - sn2,
		right,
		ri: pn,
		rj: right.length - sn2,
		expected: distance,
	};

	const pn2 = longestCommonSuffixLength(
		left,
		0,
		left.length - sn,
		right,
		0,
		right.length - sn,
	);

	yield {
		MAX: distance,
		left,
		li: pn2,
		lj: left.length - sn,
		right,
		ri: pn2,
		rj: right.length - sn,
		expected: distance,
	};

	if (typeof left === 'string') {
		const PAD_AMOUNT_1 = 13;
		const PAD_CHAR_1 = 'a';
		const PADDING_1 = Array.from({length: PAD_AMOUNT_1 + 1}).join(PAD_CHAR_1);
		const PAD_AMOUNT_2 = 7;
		const PAD_CHAR_2 = 'b';
		const PADDING_2 = Array.from({length: PAD_AMOUNT_2 + 1}).join(PAD_CHAR_2);

		yield {
			MAX: distance,
			left: concat(PADDING_1, left, PADDING_1),
			li: PAD_AMOUNT_1,
			lj: PAD_AMOUNT_1 + left.length,
			right: concat(PADDING_2, right, PADDING_2),
			ri: PAD_AMOUNT_2,
			rj: PAD_AMOUNT_2 + right.length,
			expected: distance,
		};
	}

	yield {
		MAX: distance,
		left: concat(left, left, left),
		li: left.length,
		lj: 2 * left.length,
		right: concat(right, right, right),
		ri: right.length,
		rj: 2 * right.length,
		expected: distance,
	};

	yield {
		MAX: distance,
		left: concat(right, left, right),
		li: right.length,
		lj: right.length + left.length,
		right: concat(left, right, left),
		ri: left.length,
		rj: left.length + right.length,
		expected: distance,
	};

	yield {
		MAX: distance,
		left: concat(right, left),
		li: right.length,
		lj: right.length + left.length,
		right: concat(left, right),
		ri: left.length,
		rj: left.length + right.length,
		expected: distance,
	};

	yield {
		MAX: left.length,
		left: concat(right, left),
		li: right.length,
		lj: right.length + left.length,
		right: concat(left, right),
		ri: 0,
		rj: left.length,
		expected: 0,
	};
};

for (const algorithm of algorithms) {
	for (const entry of data) {
		for (const {MAX, left, li, lj, right, ri, rj, expected} of inputs(entry)) {
			_test(algorithm, MAX, left, li, lj, right, ri, rj, expected);
			_test(algorithm, MAX, right, ri, rj, left, li, lj, expected);
			if (Array.isArray(left)) continue;
			_test(algorithm, MAX, list(left), li, lj, list(right), ri, rj, expected);
			_test(algorithm, MAX, list(right), ri, rj, list(left), li, lj, expected);
		}
	}
}
