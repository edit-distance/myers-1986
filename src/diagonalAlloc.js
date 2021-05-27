import assert from 'assert';

/**
 * DiagonalAlloc.
 *
 * @param {number} MAX
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 * @return {{array: Int32Array, center: number}}
 */
const diagonalAlloc = (MAX, li, lj, ri, rj) => {
	const lN = lj - li;
	const rN = rj - ri;
	const lMAX = Math.min(MAX, Math.max(lN, 1));
	const rMAX = Math.min(MAX, Math.max(rN, 1));
	assert(rMAX + 1 < rMAX + 1 + lMAX);
	return {
		array: new Int32Array(rMAX + 1 + lMAX),
		center: rMAX,
	};
};

export default diagonalAlloc;
