import fs from 'fs';

export {
	benchmarkInputs,
} from '../test/src/_fixtures.js'

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
