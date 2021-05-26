import assert from 'assert';

/**
 * DiagonalAlloc.
 *
 * @param {number} MAX
 * @return {Int32Array}
 */
const diagonalAlloc = (MAX) => {
	assert(MAX + 1 < 2 * MAX + 1);
	const V = new Int32Array(2 * MAX + 1);
	V[MAX + 1] = 0; // TODO unnecessary since Int32Array
	return V;
};

export default diagonalAlloc;
