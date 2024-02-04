import fs from 'fs';

import Benchtable from 'benchtable';
import {diff as fastMyersDiff} from 'fast-myers-diff'; // CORRECT FAST
// These have been removed from the bench
// import fastDiff from 'fast-diff'; // INCORRECT SLOW
// import {diff as myersDiff} from 'myers-diff'; // CORRECT VERY SLOW
// import {same as fastArrayLCS} from 'fast-array-diff'; // CORRECT VERY SLOW

import {title, benchmarkInputs} from './_fixtures.js';

const importDiff = async (name) => {
	const path = `../dist/index.${name}`;
	const mod = await import(path);
	const _diff = mod.diff;
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
		diff,
	};
};

const cjs = await importDiff('cjs');
const module = await importDiff('module.js');
const modern = await importDiff('modern.js');

const suite = new Benchtable('diffs', {isTransposed: true});

const add = (title, diff) => {
	suite.addFunction(
		title,
		(x, y, lcs) => {
			let notDeleted = x.length + y.length;
			for (const [xs, xe, ys, ye] of diff(x, y)) {
				notDeleted -= xe - xs + (ye - ys);
			}

			if (notDeleted !== 2 * lcs) throw new Error('Wrong lcs length');
		},
		{
			maxTime: 5,
		},
	);
};

add(title('fast-myers-diff'), fastMyersDiff);
add(modern.title, modern.diff);
add(module.title, module.diff);
add(cjs.title, cjs.diff);

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

for (const {N, M, L, del, ins, left, right} of benchmarkInputs) {
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
