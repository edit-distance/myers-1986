console.time('prepare');

import {diff as _diff} from './dist/profile/index.js';
const hideBin = (x) => x.slice(2);
const [n, L, D, I] = hideBin(process.argv).map((x) => Number.parseInt(x, 10));

import {
	expectedDifficulty,
	repeat,
	insertions,
} from '../_benchmark/_fixtures.js';

const diff = (x, y) => {
	const eq = (xi, yi) => x[xi] === y[yi];
	const xi = 0;
	const xj = x.length;
	const yi = 0;
	const yj = y.length;
	const MAX = xj - xi + (yj - yi);
	return _diff(MAX, eq, xi, xj, yi, yj);
};

console.log(`n ${n}`);
console.log(`L ${L}`);
console.log(`D ${D}`);
console.log(`I ${I}`);
console.log(`expected difficulty ${expectedDifficulty({L, del: D, ins: I})}`);
console.timeEnd('prepare');

console.time('input');
const lcs = repeat('a', L);
const left = insertions(repeat('d', D), lcs);
const right = insertions(repeat('i', I), lcs);
console.timeEnd('input');

console.time('diff');
for (let i = 0; i < n; ++i) {
	let c = 0;
	for (const [li, lj, ri, rj] of diff(left, right)) {
		c += lj - li + rj - ri;
	}
	console.assert(c === D + I);
}
console.timeEnd('diff');
