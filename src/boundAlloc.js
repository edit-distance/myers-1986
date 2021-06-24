import assert from 'assert';

/**
 * BoundAlloc.
 *
 * @param {number} MAX
 * @param {number} li
 * @param {number} lj
 * @return {number}
 */
const boundAlloc = (MAX, li, lj) => {
	assert(lj > li);
	return Math.min(MAX, lj - li);
};

export default boundAlloc;
