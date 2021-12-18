import * as importMapLoader from '@node-loader/import-maps';
// Import * as babelLoader from "@node-loader/babel";
import * as babelLoader from './babel.js';

const config = {
	loaders: [importMapLoader, babelLoader],
};

export default config;
