import assert from 'assert';

/**
 * ArrayType.
 *
 * @param {number} maxValue
 * @return {Int8ArrayConstructor|Int16ArrayConstructor|Int32ArrayConstructor}
 */
export default function arrayType(maxValue) {
	// If (maxValue < 2**7) return Int8Array;
	// if (maxValue < 2**15) return Int16Array;
	assert(maxValue < 2 ** 31);
	return Int32Array;
}
