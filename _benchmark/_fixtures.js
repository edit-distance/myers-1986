import fs from 'fs';

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
		const pos = (Math.random() * ans.length) | 0;
		ans = ans.slice(0, pos) + x + ans.slice(pos);
	}

	return ans;
}

export function packageInfo(packageName) {
	const file = `node_modules/${packageName}/package.json`;
	const raw = fs.readFileSync(file);
	const json = JSON.parse(raw);
	return json;
}

export const title = (name) => {
	const info = packageInfo(name);
	return `${name} v${info.version}`;
};

export const inputSize = ([L, del, ins]) => ({
	N: L + del,
	M: L + ins,
	D: del + ins,
	L,
	del,
	ins,
});

export const expectedDifficulty = ({L, del, ins}) =>
	16 * (L + del * ins) + (del + 1) ** 2 + ins ** 2;
const increasing = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const key = (compare, callable) => (a, b) => compare(callable(a), callable(b));

export const byExpectedDifficulty = key(increasing, expectedDifficulty);
