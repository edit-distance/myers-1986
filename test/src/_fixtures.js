import assert from 'assert';

import {iter} from '@iterable-iterator/iter';
import {next, StopIteration} from '@iterable-iterator/next';
import {list} from '@iterable-iterator/list';
import {map} from '@iterable-iterator/map';
import {sum} from '@iterable-iterator/reduce';
import seedRandom from 'seedrandom';

import {
	makeScan,
	oneWay,
	twoWay,
	diff,
	longestCommonPrefix,
	longestCommonSuffix,
} from '../../src/index.js';

const _oneWayScan = makeScan(oneWay);
const _twoWayScan = makeScan(twoWay);
const oneWayScan = (...args) => _oneWayScan(...args);
const twoWayScan = (...args) => _twoWayScan(...args);

/**
 * MakeEqualityFn.
 *
 * @param {Function} test
 * @param {ArrayLike} left
 * @param {ArrayLike} right
 */
export function makeEqualityFn(test, left, right) {
	/**
	 * Eq.
	 *
	 * @param {number} i
	 * @param {number} j
	 * @return {boolean}
	 */
	const eq = (i, j) => {
		assert(i >= 0 && i < left.length);
		assert(j >= 0 && j < right.length);
		return test(left[i], right[j]);
	};

	return eq;
}

/**
 * DefaultTest.
 *
 * @param {any} x
 * @param {any} y
 * @return {boolean}
 */
export function defaultTest(x, y) {
	return x === y;
}

export const distanceAlgorithms = [oneWayScan, twoWayScan];
export const diffAlgorithms = [diff];

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

const identity = (input) => ({
	left: input,
	right: input,
	editScript: [],
});

const emptyFor = (x) => (Array.isArray(x) ? [] : '');
const append = (left, suffix) => wrap(left, emptyFor(left), suffix);
const prepend = (left, prefix) => wrap(left, prefix, emptyFor(left));

export const concat = (first, ...rest) => first.concat(...rest);

const wrap = (left, prefix, suffix) => ({
	left,
	right: concat(prefix, left, suffix),
	editScript: [
		[0, 0, 0, prefix.length],
		[
			left.length,
			left.length,
			prefix.length + left.length,
			prefix.length + left.length + suffix.length,
		],
	],
});

const random = seedRandom('benchmark');

export function repeat(s1, n) {
	let ans = '';
	let ss = s1;
	while (n >= 2) {
		if (n & 1) ans += ss;
		n >>= 1;
		ss += ss;
	}

	return n & 1 ? ans + ss : ans;
}

export function insertions(insertion, into) {
	let ans = into;
	for (const x of insertion) {
		// eslint-disable-next-line unicorn/prefer-math-trunc
		const pos = (random() * ans.length) | 0;
		ans = ans.slice(0, pos) + x + ans.slice(pos);
	}

	return ans;
}

export const inputSize = ([L, del, ins]) => ({
	N: L + del,
	M: L + ins,
	D: del + ins,
	L,
	del,
	ins,
});

export function makeInput({L, del, ins}) {
	const lcs = repeat('a', L);
	const left = insertions(repeat('d', del), lcs);
	const right = insertions(repeat('i', ins), lcs);
	return {
		left,
		right,
		lcs,
	};
}

export const calcPatch = function* (editScript, right) {
	for (const [li, lj, ri, rj] of editScript)
		yield [li, lj, right.slice(ri, rj)];
};

export const applyPatch = (patch, left, li, lj) => {
	let result = left.slice(0, 0);
	for (const [lk, ll, replacement] of patch) {
		result = concat(result, left.slice(li, lk), replacement);
		li = ll;
	}

	return concat(result, left.slice(li, lj));
};

const boxShift =
	(xShift, yShift) =>
	([x0, x1, y0, y1]) =>
		[xShift + x0, xShift + x1, yShift + y0, yShift + y1];

const shiftEditScript = (xShift, yShift, editScript) =>
	editScript && list(map(boxShift(xShift, yShift), editScript));

export const expectedDifficulty = ({L, del, ins}) =>
	16 * (L + del * ins) + (del + 1) ** 2 + ins ** 2;
const increasing = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const key = (compare, callable) => (a, b) => compare(callable(a), callable(b));

export const byExpectedDifficulty = key(increasing, expectedDifficulty);

export const benchmarkSizes = [
	[100, 0, 20],
	[100, 20, 0],
	[100, 10, 10],
	[10, 4, 200],
	[10000, 0, 20],
	[10000, 20, 0],
	[10000, 10, 10],
	[10, 100, 100],
	[10, 1000, 1000],
	[10000, 100, 100],
	[10000, 200, 0],
	[10000, 0, 200],
]
	.map(inputSize) // eslint-disable-line unicorn/no-array-callback-reference
	.sort(byExpectedDifficulty);

export const benchmarkInputs = benchmarkSizes.map((parameters) => ({
	distance: parameters.D,
	...parameters,
	...makeInput(parameters),
}));

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
			[2, 7, 2, 3],
			[8, 8, 4, 5],
		],
	},
	{
		left: 'xmjyauz',
		right: 'mzjawxu',
		editScript: [
			[0, 1, 0, 0],
			[1, 1, 1, 2],
			[3, 4, 3, 3],
			[4, 4, 4, 6],
			[6, 7, 7, 7],
		],
	},
	{
		left: 'ABCDGH',
		right: 'AEDFHR',
		editScript: [
			[1, 3, 1, 2],
			[4, 5, 3, 4],
			[6, 6, 5, 6],
		],
	},
	{
		left: 'AGGTAB',
		right: 'GXTXAYB',
		editScript: [
			[0, 1, 0, 0],
			[2, 3, 1, 2], // Careful that one is ambiguous
			[4, 4, 3, 4],
			[5, 5, 5, 6],
		],
	},
	{
		left: 'abc',
		right: 'def',
		editScript: [[0, 3, 0, 3]],
	},
	{
		left: 'abcde',
		right: 'ace',
		editScript: [
			[1, 2, 1, 1],
			[3, 4, 2, 2],
		],
	},
	{
		left: 'ACBAED',
		right: 'ABCADF',
		editScript: [
			[1, 1, 1, 2],
			[2, 3, 3, 3],
			[4, 5, 4, 4],
			[6, 6, 5, 6],
		],
	},
	{
		left: 'BANANA',
		right: 'ATANA',
		editScript: [
			[0, 1, 0, 0],
			[2, 3, 1, 2],
		],
	},
	{
		left: 'xxxxxAxxxxx',
		right: 'yyyyyAyyyyy',
		editScript: [
			[0, 5, 0, 5],
			[6, 11, 6, 11],
		],
	},
	{
		left: 'AAAAAAAAAA',
		right: 'AAAAAxAAAAA',
		editScript: [[5, 5, 5, 6]],
	},
	{
		left: 'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
		right: 'RRRRRRRRRRRRRRRRRRRRRRRRRRR',
		editScript: [[0, 45, 0, 27]],
	},
	{
		left: 'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
		right: 'RRRRRRRRRRRRRRRRRRRRRRRRRR',
		editScript: [[0, 44, 0, 26]],
	},
	{
		left: 'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
		right: 'RRRRRRRRRRRRRRRRRRRRRRRRRRRR',
		editScript: [[0, 45, 0, 28]],
	},
	{
		left: 'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL',
		right: 'RRRRRRRRRRRRRRRRRRRRRRRRRRR',
		editScript: [[0, 44, 0, 27]],
	},
];

export const distance = (editScript) =>
	sum(map(([li, lj, ri, rj]) => lj - li + rj - ri, editScript));

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

export const ensureMAX = function* (input) {
	const {li, lj, ri, rj} = input;
	yield {
		MAX: lj - li + rj - ri,
		...input, // Rewrites MAX if present
	};
};

export const tweakMAX = function* (input) {
	yield input;

	const {left, li, lj, right, ri, rj, distance} = input;

	yield {
		...input,
		MAX: distance,
	};

	yield {
		...input,
		MAX: distance - 1,
		distance: -1,
		editScript: undefined,
	};

	const isSame = arrayLikeIsEqual(left, li, lj, right, ri, rj);

	yield {
		...input,
		MAX: 0,
		distance: isSame ? 0 : -1,
		editScript: isSame ? [] : undefined,
	};
};

export const swapInputs = function* (input) {
	yield input;

	const {left, li, lj, right, ri, rj, editScript} = input;
	yield {
		...input,
		left: right,
		li: ri,
		lj: rj,
		right: left,
		ri: li,
		rj: lj,
		editScript: swapEditScript(editScript),
	};
};

export const swapEditScript = (editScript) =>
	editScript?.map(([l0, l1, r0, r1]) => [r0, r1, l0, l1]);

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
	const {left, li, lj, right, ri, rj, editScript} = input;

	const pn = longestCommonPrefixLength(left, li, lj, right, ri, rj);

	yield {
		...input,
		li: li + pn,
		ri: ri + pn,
		editScript: shiftEditScript(pn, pn, editScript),
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
		editScript: shiftEditScript(pn, pn, editScript),
	};

	const pn2 = longestCommonSuffixLength(left, li, lj - sn, right, ri, rj - sn);

	yield {
		...input,
		li: li + pn2,
		lj: lj - sn,
		ri: ri + pn2,
		rj: rj - sn,
		editScript: shiftEditScript(pn2, pn2, editScript),
	};
};

export const addPadding = function* (input) {
	yield input;
	const {left, li, lj, right, ri, rj, editScript} = input;

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
			editScript: shiftEditScript(PAD_AMOUNT_1, PAD_AMOUNT_2, editScript),
		};
	}

	yield {
		...input,
		left: concat(left, left, left),
		li: left.length + li,
		lj: left.length + lj,
		right: concat(right, right, right),
		ri: right.length + ri,
		rj: right.length + rj,
		editScript: shiftEditScript(left.length, right.length, editScript),
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
		editScript: shiftEditScript(right.length, left.length, editScript),
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
		editScript: [],
	};

	yield {
		...input,
		left: concat(right, left, right),
		li: right.length + li,
		lj: right.length + lj,
		right: concat(left, right, left),
		ri: left.length + ri,
		rj: left.length + rj,
		editScript: shiftEditScript(right.length, left.length, editScript),
	};
};

export const simplify = function* (input) {
	yield {
		...input,
		editScript: simplifyEditScript(input.editScript),
	};
};

export const simplifyEditScript = (editScript) => {
	if (editScript === undefined) return undefined;
	return Array.from(
		mergeTouchingRectangles(
			editScript.filter(([li, lj, ri, rj]) => li < lj || ri < rj),
		),
	);
};

const mergeTouchingRectangles = function* (rectangles) {
	const it = iter(rectangles);
	let pending;
	try {
		pending = next(it);
		while (true) {
			const [l0, l1, r0, r1] = pending;
			const current = next(it);
			const [L0, L1, R0, R1] = current;
			if (l1 === L0 && r1 === R0) {
				pending = [l0, L1, r0, R1];
			} else {
				yield pending;
				pending = current;
			}
		}
	} catch (error) {
		if (!(error instanceof StopIteration)) throw error;
		if (pending !== undefined) yield pending;
	}
};
