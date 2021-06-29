import assert from 'assert';
// Import arrayType from './arrayType.js';

/**
 * ArrayRealloc.
 *
 * @param {number} maxValue
 * @param {Int8Array|Int16Array|Int32Array} B
 * @return {Int8Array|Int16Array|Int32Array}
 */
export default function arrayRealloc(maxValue, B) {
	assert(maxValue < 2 ** (B.BYTES_PER_ELEMENT * 8 - 1));
	assert(maxValue >= -(2 ** (B.BYTES_PER_ELEMENT * 8 - 1)));
	return B;
	// Const TypedArray = arrayType(maxValue);
	// return B.constructor === TypedArray
	// ? B
	// : new TypedArray(B.buffer, B.byteOffset);
}
