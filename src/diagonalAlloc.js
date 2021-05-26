import assert from 'assert';

/**
 * DiagonalAlloc.
 *
 * @param {number} MAX
 * @return {Int32Array}
 */
const diagonalAlloc = (MAX) => {
	assert(MAX + 1 < 2 * MAX + 1);
	return new Int32Array(2 * MAX + 1);
};

export default diagonalAlloc;
