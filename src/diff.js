import validate32 from './validate32.js';
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
	validate32(MAX, li, lj, ri, rj);
	return diff32(MAX | 0, eq, li | 0, lj | 0, ri | 0, rj | 0);
}
