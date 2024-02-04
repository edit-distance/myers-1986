import process from 'node:process';

import {
	inflate,
	ensureDistance,
	data,
	benchmarkInputs,
} from '../test/src/_fixtures.js';

import {diff as _diff} from './dist/profile/index.js';

console.time('prepare');

const hideBin = (x) => x.slice(2);
const [n] = hideBin(process.argv).map((x) => Number.parseInt(x, 10));

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
const inputs = [...inflate(data, [ensureDistance]), ...benchmarkInputs];
console.timeEnd('prepare');

console.time('analyze');
for (let i = 0; i < n; ++i) {
	for (const {distance, left, right} of inputs) {
		let c = 0;
		for (const [li, lj, ri, rj] of diff(left, right)) {
			c += lj - li + rj - ri;
		}

		console.assert(c === distance);
	}
}

console.timeEnd('analyze');
