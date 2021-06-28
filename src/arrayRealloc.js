import arrayType from './arrayType.js';

/**
 * ArrayRealloc.
 *
 * @param {number} maxValue
 * @param {Int8Array|Int16Array|Int32Array} B
 * @return {Int8Array|Int16Array|Int32Array}
 */
export default function arrayRealloc(maxValue, B) {
	const TypedArray = arrayType(maxValue);
	return B.constructor === TypedArray
		? B
		: new TypedArray(B.buffer, B.byteOffset);
}
