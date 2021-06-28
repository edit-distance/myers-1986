import assert from 'assert';

/**
 * BoundAlloc.
 *
 * @param {number} MAX
 * @param {number} li
 * @param {number} lj
 * @return {number}
 */
export default function boundAlloc(MAX, li, lj) {
	assert(lj > li);
	return Math.min(MAX, (lj - li) | 0);
}
