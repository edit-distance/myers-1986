import {TypeError} from '@failure-abstraction/error';

/**
 * Int32.
 *
 * @param {any} x
 * @return {number} A signed 32-bit integer.
 */
export default function int32(x) {
	if (!Number.isInteger(x) || x < -2_147_483_648 || x > 2_147_483_647) {
		throw new TypeError();
	}

	return x | 0;
}
