import fs from 'fs';

// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';
import {diff as fastMyersDiff} from 'fast-myers-diff'; // CORRECT FAST
// These have been removed from the bench
// import fastDiff from 'fast-diff'; // INCORRECT SLOW
// import {diff as myersDiff} from 'myers-diff'; // CORRECT VERY SLOW
// import {same as fastArrayLCS} from 'fast-array-diff'; // CORRECT VERY SLOW

const importDiff = async (name) => {
	const path = `../dist/index.${name}`;
	const _diff = (await import(path)).diff;
	const diff = (x, y) => {
		const eq = (xi, yi) => x[xi] === y[yi];
		const xi = 0;
		const xj = x.length;
		const yi = 0;
		const yj = y.length;
		const MAX = xj - xi + (yj - yi);
		return _diff(MAX, eq, xi, xj, yi, yj);
	};

	const stats = fs.statSync(path);
	const mtime = stats.mtime;
	const title = `${name} ${mtime.toISOString()}`;

	return {
		title,
		diff
	};
};

const cjs = await importDiff('cjs');
const module = await importDiff('module.js');
const modern = await importDiff('modern.js');

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

const add = (title, diff) => {
	suite.addFunction(title, (x, y, lcs) => {
		let notDeleted = x.length + y.length;
		for (const [xs, xe, ys, ye] of diff(x, y)) {
			notDeleted -= xe - xs + (ye - ys);
		}

		if (notDeleted !== 2 * lcs) throw new Error('Wrong lcs length');
	});
}

//add(cjs.title, cjs.diff);
//add(module.title, module.diff);
add(modern.title, modern.diff);
add(title('fast-myers-diff'), fastMyersDiff);

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
  const kept = fastArrayLCS(x.split(''), y.split('')).length;
  if(kept !== lcs) throw new Error('Wrong lcs length');
});
*/

/*
// INCORRECT (probably because of output cleanup)
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
