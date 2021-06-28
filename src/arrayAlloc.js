import arrayType from './arrayType.js';

/**
 * ArrayAlloc.
 *
 * @param {number} maxValue
 * @param {number} length
 * @return {Int8Array|Int16Array|Int32Array}
 */
export default function arrayAlloc(maxValue, length) {
	const TypedArray = arrayType(maxValue);
	return new TypedArray(length);
}
