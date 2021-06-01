import fs from 'fs';

// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {diff as fastMyersDiff} from 'fast-myers-diff';
// Import fastDiff from 'fast-diff'; // INCORRECT
// import {diff as myersDiff} from 'myers-diff'; // CORRECT SLOW
// import {same as fastArrayDiff} from 'fast-array-diff'; // CORRECT SLOW
// import {diff as current} from '../src/index.js'; // Needs {"type": "module"}.
import cjsBuild from '../dist/index.js';
const cjsBuildDiff = cjsBuild.diff;

const stats = fs.statSync('../dist/index.js');
const mtime = stats.mtime;
const cjsBuildTitle = `cjsBuild ${mtime.toISOString()}`;

import Benchtable from 'benchtable';
const suite = new Benchtable('diffs', {isTransposed: true});
import seedRandom from 'seedrandom';
seedRandom('benchmark', {global: true});

import {
	repeat,
	insertions,
	title,
	inputSize,
	byExpectedDifficulty,
} from './_fixtures.js';

suite.addFunction(cjsBuildTitle, (x, y, lcs) => {
	let notDeleted = x.length + y.length;
	const eq = (xi, yi) => x[xi] === y[yi];
	const xi = 0;
	const xj = x.length;
	const yi = 0;
	const yj = y.length;
	const MAX = xj - xi + (yj - yi);
	for (const [xs, xe, ys, ye] of cjsBuildDiff(MAX, eq, xi, xj, yi, yj)) {
		notDeleted -= xe - xs + (ye - ys);
	}

	if (notDeleted !== 2 * lcs) throw new Error('Wrong lcs length');
});

suite.addFunction(title('fast-myers-diff'), (x, y, lcs) => {
	let notDeleted = x.length + y.length;
	for (const [xs, xe, ys, ye] of fastMyersDiff(x, y)) {
		notDeleted -= xe - xs + (ye - ys);
	}

	if (notDeleted !== 2 * lcs) throw new Error('Wrong lcs length');
});

/*
// SLOW
suite.addFunction(title('myers-diff'), (x, y, lcs) => {
  let notDeleted = x.length + y.length
  for(const t of myersDiff(x, y, {compare: 'chars'})){
    notDeleted -= t.lhs.del + t.rhs.add;
  }
  if (notDeleted !== 2*lcs) throw new Error('Wrong lcs length');
});
*/

/*
// SLOW
suite.addFunction(title('fast-array-diff'), (x, y, lcs) => {
  const kept = fastArrayDiff(x.split(''), y.split('')).length;
  if(kept !== lcs) throw new Error('Wrong lcs length');
});
*/

/*
// INCORRECT
suite.addFunction(title('fast-diff'), (x, y, lcs) => {
  let kept = 0;
  for (const [side, slice] of fastDiff(x, y)) {
    if (side === 0) kept += slice.length;
  }
  if (kept !== lcs) throw new Error('Wrong lcs length');
});
*/

const sizes = [
	[10, 100, 100],
	[10, 4, 200],
	[100, 10, 10],
	[100, 20, 0],
	[100, 0, 20],
	[10, 1000, 1000],
	[10000, 100, 100],
	[10000, 200, 0],
	[10000, 0, 200],
	[10000, 10, 10],
	[10000, 20, 0],
	[10000, 0, 20],
]
	.map(inputSize) // eslint-disable-line unicorn/no-array-callback-reference
	.sort(byExpectedDifficulty);

for (const {N, M, L, del, ins} of sizes) {
	const lcs = repeat('a', L);
	const left = insertions(repeat('d', del), lcs);
	const right = insertions(repeat('i', ins), lcs);
	suite.addInput(
		`N+M=${N + M} N=${N} M=${M} |lcs|=${L} |-|=${del} |+|=${ins}`,
		[left, right, L],
	);
}

suite.on('cycle', (evt) => {
	console.log(evt.target.name);
});

suite.on('complete', () => {
	console.log(suite.table.toString());
});

suite.run();
