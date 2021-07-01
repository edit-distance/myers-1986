import int32 from './int32.js';
import diff32 from './diff32.js';

/**
 * Yields diff rectangles. Throws if indices are not int32.
 *
 * @param {number} MAX
 * @param {Function} eq
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @return {IterableIterator}
 */
export default function diff(MAX, eq, li, lj, ri, rj) {
	return diff32(int32(MAX), eq, int32(li), int32(lj), int32(ri), int32(rj));
}
