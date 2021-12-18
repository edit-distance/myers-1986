:abacus: [@edit-distance/myers-1986](https://edit-distance.github.io/myers-1986)
==

Reasonably efficient implementation of Eugene W. Myers's exact longest common
subsequence and minimum edit-distance algorithm for JavaScript.
See [docs](https://edit-distance.github.io/myers-1986/index.html).

> :building_construction: Caveat emptor! This is work in progress. Code may be
> working. Documentation may be present. Coherence may be. Maybe.

> :warning: Only signed 32-bit integers are supported for `MAX`, `xi`, `xj`,
> `yi`, `yj`. This is also true for the values `xj - xi` and `yj - yi` but is
> not enforced. You should be fine if the elements of each pair have the same
> sign. This means you cannot diff things with more than `2,147,483,647`
> parts (array elements, string characters, text words or lines).

```js
// Example 1: compute Edit Distance.

import {makeScan, twoWay} from '@edit-distance/myers-1986';

const scan = makeScan(twoWay);

const ed = (x, y) => {
	const eq = (xi, yi) => x[xi] === y[yi];
	const xi = 0;
	const xj = x.length;
	const yi = 0;
	const yj = y.length;
	const MAX = xj - xi + (yj - yi);
	return scan(MAX, eq, xi, xj, yi, yj);
};

ed('BANANA', 'ATANA'); // 3

// Example 2: compute LCS.

import {diff} from '@edit-distance/myers-1986';

const rectangles = (x, y) => {
	const eq = (xi, yi) => x[xi] === y[yi];
	const xi = 0;
	const xj = x.length;
	const yi = 0;
	const yj = y.length;
	const MAX = xj - xi + (yj - yi);
	return diff(MAX, eq, xi, xj, yi, yj);
};

const lcs = (x, y) => {
	let result = x.slice(0, 0);
	let xp = 0;
	for (const [x0, x1] of rectangles(x, y)) {
		result = result.concat(x.slice(xp, x0));
		xp = x1;
	}

	return result.concat(x.slice(xp, x.length));
};

lcs('BANANA', 'ATANA'); // AANA
```

[![License](https://img.shields.io/github/license/edit-distance/myers-1986.svg)](https://raw.githubusercontent.com/edit-distance/myers-1986/main/LICENSE)
[![Version](https://img.shields.io/npm/v/@edit-distance/myers-1986.svg)](https://www.npmjs.org/package/@edit-distance/myers-1986)
[![Tests](https://img.shields.io/github/workflow/status/edit-distance/myers-1986/ci?event=push&label=tests)](https://github.com/edit-distance/myers-1986/actions/workflows/ci.yml?query=branch:main)
[![Dependencies](https://img.shields.io/librariesio/github/edit-distance/myers-1986.svg)](https://github.com/edit-distance/myers-1986/network/dependencies)
[![GitHub issues](https://img.shields.io/github/issues/edit-distance/myers-1986.svg)](https://github.com/edit-distance/myers-1986/issues)
[![Downloads](https://img.shields.io/npm/dm/@edit-distance/myers-1986.svg)](https://www.npmjs.org/package/@edit-distance/myers-1986)

[![Code issues](https://img.shields.io/codeclimate/issues/edit-distance/myers-1986.svg)](https://codeclimate.com/github/edit-distance/myers-1986/issues)
[![Code maintainability](https://img.shields.io/codeclimate/maintainability/edit-distance/myers-1986.svg)](https://codeclimate.com/github/edit-distance/myers-1986/trends/churn)
[![Code coverage (cov)](https://img.shields.io/codecov/c/gh/edit-distance/myers-1986/main.svg)](https://codecov.io/gh/edit-distance/myers-1986)
[![Code technical debt](https://img.shields.io/codeclimate/tech-debt/edit-distance/myers-1986.svg)](https://codeclimate.com/github/edit-distance/myers-1986/trends/technical_debt)
[![Documentation](https://edit-distance.github.io/myers-1986/badge.svg)](https://edit-distance.github.io/myers-1986/source.html)
[![Package size](https://img.shields.io/bundlephobia/minzip/@edit-distance/myers-1986)](https://bundlephobia.com/result?p=@edit-distance/myers-1986)

## :bicyclist: Benchmark

| input                                               | fast-myers-diff v3.0.1 |  modern.js v0.0.1 |  module.js v0.0.1 |         cjs v0.0.1 |
| --------------------------------------------------- | ---------------------: | ----------------: | ----------------: | -----------------: |
| N+M=220 N=100 M=120 LCS=100 DEL=0 INS=20            |      77,170    ops/sec | 99,952    ops/sec | 97,806    ops/sec | 100,333    ops/sec |
| N+M=220 N=120 M=100 LCS=100 DEL=20 INS=0            |      68,575    ops/sec | 90,582    ops/sec | 89,178    ops/sec |  90,030    ops/sec |
| N+M=220 N=110 M=110 LCS=100 DEL=10 INS=10           |      63,494    ops/sec | 83,439    ops/sec | 81,201    ops/sec |  82,661    ops/sec |
| N+M=224 N=14 M=210 LCS=10 DEL=4 INS=200             |       7,112    ops/sec | 10,346    ops/sec | 10,406    ops/sec |  10,898    ops/sec |
| N+M=20020 N=10000 M=10020 LCS=10000 DEL=0 INS=20    |       3,282    ops/sec |  4,313    ops/sec |  4,174    ops/sec |   4,415    ops/sec |
| N+M=20020 N=10020 M=10000 LCS=10000 DEL=20 INS=0    |       3,317    ops/sec |  4,040    ops/sec |  4,035    ops/sec |   4,947    ops/sec |
| N+M=20020 N=10010 M=10010 LCS=10000 DEL=10 INS=10   |       2,414    ops/sec |  2,939    ops/sec |  2,843    ops/sec |   3,009    ops/sec |
| N+M=220 N=110 M=110 LCS=10 DEL=100 INS=100          |       1,607    ops/sec |  2,737    ops/sec |  2,720    ops/sec |   2,887    ops/sec |
| N+M=20200 N=10000 M=10200 LCS=10000 DEL=0 INS=200   |         871    ops/sec |  1,258    ops/sec |  1,254    ops/sec |   1,293    ops/sec |
| N+M=20200 N=10200 M=10000 LCS=10000 DEL=200 INS=0   |         844    ops/sec |  1,240    ops/sec |  1,258    ops/sec |   1,309    ops/sec |
| N+M=20200 N=10100 M=10100 LCS=10000 DEL=100 INS=100 |         703    ops/sec |    978    ops/sec |    976    ops/sec |     978    ops/sec |
| N+M=2020 N=1010 M=1010 LCS=10 DEL=1000 INS=1000     |          19.10 ops/sec |     36.35 ops/sec |     36.45 ops/sec |      38.16 ops/sec |
