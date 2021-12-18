/**
 * Based on source of @node-loader/babel
 *
 * Source: https://github.com/node-loader/node-loader-babel
 *
 * with the following license:
 *
 * MIT License
 *
 * Copyright (c) 2020 node-loaders
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import process from 'process';
import path from 'path';
import {fileURLToPath} from 'url';
import {loadOptionsAsync, transformAsync} from '@babel/core';

const BABEL_FORMATS_TRANSFORMED = new Set(['module']);

const BABEL_CONFIG_FILES = new Set([
	'.babelrc.js',
	'.babelrc.mjs',
	'babel.config.js',
	'babel.config.mjs',
	'.babelrc',
	'.babelrc.cjs',
	'babel.config.cjs',
]);

const anyURLToPathOrUndefined = (url) => {
	try {
		return fileURLToPath(url);
	} catch (error) {
		if (error instanceof TypeError && error.code === 'ERR_INVALID_URL_SCHEME') {
			return undefined;
		}

		throw error;
	}
};

const isBabelConfigFile = (filename) => {
	const basename = path.basename(filename);
	return BABEL_CONFIG_FILES.has(basename);
};

const getSourceType = (format) => {
	switch (format) {
		case 'module':
			return 'module';
		case 'commonjs':
			return 'script';
		default:
			return 'unambiguous';
	}
};

const prepare = async (url, context, defaultLoad) => {
	const original = await defaultLoad(url, context, defaultLoad);

	const noop = () => ({
		transform: false,
		original,
	});

	if (
		/node_modules/.test(url) ||
		/node:/.test(url) ||
		!BABEL_FORMATS_TRANSFORMED.has(original.format)
	) {
		return noop();
	}

	const filename = anyURLToPathOrUndefined(url);

	// Babel config files can themselves be ES modules,
	// but transforming those could require more than one pass.
	if (isBabelConfigFile(filename)) return noop();

	return {
		transform: true,
		original,
		options: {
			filename,
		},
	};
};

const transformed = async ({format, source}, {filename}) => {
	const options = await loadOptionsAsync({
		sourceType: getSourceType(format),
		root: process.cwd(),
		rootMode: 'root',
		filename,
		configFile: true,
	});

	const result = await transformAsync(source, options);

	return {
		source: result.code,
		// TODO: look at babel config to see whether it will output ESM/CJS or other formats
		format,
	};
};

export const load = async (url, context, defaultLoad) => {
	const {transform, original, options} = await prepare(
		url,
		context,
		defaultLoad,
	);
	return transform ? transformed(original, options) : original;
};
