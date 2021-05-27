import {list} from '@iterable-iterator/list';
import {chain} from '@iterable-iterator/chain';
import {constant, inverse} from '@iterable-iterator/mapping';

import {
	makeScan,
	oneWay,
	twoWay,
	longestCommonPrefix,
	longestCommonSuffix,
	makeEqualityFn,
	defaultTest,
} from '../../src/index.js';

const _oneWayScan = makeScan(oneWay);
const _twoWayScan = makeScan(twoWay);
const oneWayScan = (...args) => _oneWayScan(...args);
const twoWayScan = (...args) => _twoWayScan(...args);

export const algorithms = [oneWayScan, twoWayScan];

export const repr = (x) => JSON.stringify(x);

export const arrayLikeIsEqual = (a, ai, aj, b, bi, bj) => {
	if (aj - ai !== bj - bi) return false;
	const eq = makeEqualityFn(defaultTest, a, b);
	return longestCommonPrefix(eq, ai, aj, bi, bj) === aj;
};

export const longestCommonPrefixLength = (a, ai, aj, b, bi, bj) => {
	const eq = makeEqualityFn(defaultTest, a, b);
	return longestCommonPrefix(eq, ai, aj, bi, bj) - ai;
};

export const longestCommonSuffixLength = (a, ai, aj, b, bi, bj) => {
	const eq = makeEqualityFn(defaultTest, a, b);
	return aj - longestCommonSuffix(eq, aj, ai, bj, bi);
};

const keep = (input) => inverse(constant(input, 0));
const insert = (input) => inverse(constant(input, 1));

const identity = (input) => ({
	left: input,
	right: input,
	editScript: list(keep(input)),
});

const emptyFor = (x) => (Array.isArray(x) ? [] : '');
const append = (left, suffix) => wrap(left, emptyFor(left), suffix);
const prepend = (left, prefix) => wrap(left, prefix, emptyFor(left));

export const concat = (first, ...rest) => first.concat(...rest);

const wrap = (left, prefix, suffix) => ({
	left,
	right: concat(prefix, left, suffix),
	editScript: list(chain(insert(prefix), keep(left), insert(suffix))),
});

export const data = [
	identity(''),
	identity('abc'),
	identity('AAAAAAAAAA'),
	append('', 'abcdefghijkl'),
	append('abra', 'cadabra'),
	prepend('x', 'AAAAAAAAAA'),
	prepend('xx', 'AAAAAAAAAA'),
	wrap('AAAAAAAAA', 'x', 'x'),
	wrap('AAAAAAAAAA', 'x', 'x'),
	wrap('AAAAAAAAA', 'xx', 'xx'),
	wrap('AAAAAAAAAA', 'xx', 'xx'),
	{
		left: ['this', 'is', 'some', 'text', 'that', 'will', 'be', 'changed'],
		right: ['this', 'is', 'the', 'changed', 'text'],
		editScript: [
			[0, 'this'],
			[0, 'is'],
			[-1, 'some'],
			[-1, 'text'],
			[-1, 'that'],
			[-1, 'will'],
			[-1, 'be'],
			[1, 'the'],
			[0, 'changed'],
			[1, 'text'],
		],
	},
	{
		left: 'xmjyauz',
		right: 'mzjawxu',
		editScript: [
			[-1, 'x'],
			[0, 'm'],
			[1, 'z'],
			[0, 'j'],
			[-1, 'y'],
			[0, 'a'],
			[1, 'w'],
			[1, 'x'],
			[0, 'u'],
			[-1, 'z'],
		],
	},
	{
		left: 'ABCDGH',
		right: 'AEDFHR',
		editScript: [
			[0, 'A'],
			[-1, 'B'],
			[-1, 'C'],
			[1, 'E'],
			[0, 'D'],
			[-1, 'G'],
			[1, 'F'],
			[0, 'H'],
			[1, 'R'],
		],
	},
	{
		left: 'AGGTAB',
		right: 'GXTXAYB',
		editScript: [
			[-1, 'A'],
			[0, 'G'],
			[-1, 'G'],
			[1, 'X'],
			[0, 'T'],
			[1, 'X'],
			[0, 'A'],
			[1, 'Y'],
			[0, 'B'],
		],
	},
	{
		left: 'abc',
		right: 'def',
		editScript: [
			[-1, 'a'],
			[-1, 'b'],
			[-1, 'c'],
			[1, 'd'],
			[1, 'e'],
			[1, 'f'],
		],
	},
	{
		left: 'abcde',
		right: 'ace',
		editScript: [
			[0, 'a'],
			[-1, 'b'],
			[0, 'c'],
			[-1, 'd'],
			[0, 'e'],
		],
	},
	{
		left: 'ACBAED',
		right: 'ABCADF',
		editScript: [
			[0, 'A'],
			[1, 'B'],
			[0, 'C'],
			[-1, 'B'],
			[0, 'A'],
			[-1, 'E'],
			[0, 'D'],
			[1, 'F'],
		],
	},
	{
		left: 'BANANA',
		right: 'ATANA',
		editScript: [
			[-1, 'B'],
			[0, 'A'],
			[-1, 'N'],
			[1, 'T'],
			[0, 'A'],
			[0, 'N'],
			[0, 'A'],
		],
	},
];

const distance = (editScript) => editScript.filter(([x]) => x !== 0).length;

export const inflate = function* (iterable, transforms) {
	if (transforms.length === 0) {
		yield* iterable;
		return;
	}

	const [firstTransform, ...otherTransforms] = transforms;

	for (const item of iterable) {
		yield* inflate(firstTransform(item), otherTransforms);
	}
};

export const addDefaultBounds = function* (input) {
	yield {
		...input,
		li: 0,
		lj: input.left.length,
		ri: 0,
		rj: input.right.length,
	};
};

export const ensureDistance = function* (input) {
	yield {
		...input,
		distance: input.distance ?? distance(input.editScript),
	};
};

export const tweakMAX = function* (input) {
	const {left, li, lj, right, ri, rj, distance} = input;
	yield {
		...input,
		MAX: lj - li + rj - ri,
	};

	yield {
		...input,
		MAX: distance,
	};

	yield {
		...input,
		MAX: distance - 1,
		distance: -1,
	};

	yield {
		...input,
		MAX: 0,
		distance: arrayLikeIsEqual(left, li, lj, right, ri, rj) ? 0 : -1,
	};
};

export const swapInputs = function* (input) {
	yield input;

	const {left, li, lj, right, ri, rj} = input;
	yield {
		...input,
		left: right,
		li: ri,
		lj: rj,
		right: left,
		ri: li,
		rj: lj,
	};
};

export const listifyStringInputs = function* (input) {
	yield input;
	const {left, right} = input;
	if (!Array.isArray(left)) {
		yield {
			...input,
			left: list(left),
			right: list(right),
		};
	}
};

export const tweakBounds = function* (input) {
	yield input;
	const {left, li, lj, right, ri, rj} = input;

	const pn = longestCommonPrefixLength(left, li, lj, right, ri, rj);

	yield {
		...input,
		li: li + pn,
		ri: ri + pn,
	};

	const sn = longestCommonSuffixLength(left, li, lj, right, ri, rj);

	yield {
		...input,
		lj: lj - sn,
		rj: rj - sn,
	};

	const sn2 = longestCommonSuffixLength(left, li + pn, lj, right, ri + pn, rj);

	yield {
		...input,
		li: li + pn,
		lj: lj - sn2,
		ri: ri + pn,
		rj: rj - sn2,
	};

	const pn2 = longestCommonSuffixLength(left, li, lj - sn, right, ri, rj - sn);

	yield {
		...input,
		li: li + pn2,
		lj: lj - sn,
		ri: ri + pn2,
		rj: rj - sn,
	};
};

export const addPadding = function* (input) {
	yield input;
	const {left, li, lj, right, ri, rj} = input;

	if (typeof left === 'string') {
		const PAD_AMOUNT_1 = 13;
		const PAD_CHAR_1 = 'a';
		const PADDING_1 = Array.from({length: PAD_AMOUNT_1 + 1}).join(PAD_CHAR_1);
		const PAD_AMOUNT_2 = 7;
		const PAD_CHAR_2 = 'b';
		const PADDING_2 = Array.from({length: PAD_AMOUNT_2 + 1}).join(PAD_CHAR_2);

		yield {
			...input,
			left: concat(PADDING_1, left, PADDING_1),
			li: li + PAD_AMOUNT_1,
			lj: lj + PAD_AMOUNT_1,
			right: concat(PADDING_2, right, PADDING_2),
			ri: ri + PAD_AMOUNT_2,
			rj: rj + PAD_AMOUNT_2,
		};
	}

	yield {
		...input,
		left: concat(left, left, left),
		li: left.length,
		lj: 2 * left.length,
		right: concat(right, right, right),
		ri: right.length,
		rj: 2 * right.length,
	};

	yield {
		...input,
		left: concat(right, left),
		li: ri,
		lj: rj,
		right: concat(left, right),
		ri: li,
		rj: lj,
	};

	yield {
		...input,
		left: concat(right, left),
		li: right.length + li,
		lj: right.length + lj,
		right: concat(left, right),
		ri: left.length + ri,
		rj: left.length + rj,
	};

	yield {
		...input,
		left: concat(right, left),
		li: right.length + li,
		lj: right.length + lj,
		right: concat(left, right),
		ri: li,
		rj: lj,
		distance: 0,
	};

	yield {
		...input,
		left: concat(right, left, right),
		li: right.length + li,
		lj: right.length + lj,
		right: concat(left, right, left),
		ri: left.length + ri,
		rj: left.length + rj,
	};
};
