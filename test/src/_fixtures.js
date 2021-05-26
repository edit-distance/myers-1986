import {list} from '@iterable-iterator/list';
import {chain} from '@iterable-iterator/chain';
import {constant, inverse} from '@iterable-iterator/mapping';

import {diagonalScan, findMiddleSnake} from '../../src/index.js';

const scan = (MAX, left, right) => diagonalScan(MAX, left, right);
const dc = (MAX, left, right) => findMiddleSnake(MAX, left, right);

export const algorithms = [scan, dc];

export const repr = (x) => JSON.stringify(x);

const keep = (input) => inverse(constant(input, 0));
const insert = (input) => inverse(constant(input, 1));

const identity = (input) => ({
	left: input,
	right: input,
	editScript: list(keep(input)),
});

const append = (left, suffix) => wrap(left, '', suffix);
const prepend = (left, prefix) => wrap(left, prefix, '');

const wrap = (left, prefix, suffix) => ({
	left,
	right: prefix + left + suffix,
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
];

const distance = (editScript) => editScript.filter(([x]) => x !== 0).length;

for (const item of data) {
	item.distance = distance(item.editScript);
}
