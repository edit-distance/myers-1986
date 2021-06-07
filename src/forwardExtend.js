import longestCommonPrefix from './longestCommonPrefix.js';

/**
 * Diagonal forward extension subroutine.
 *
 * @param {number} kMin
 * @param {number} kMax
 * @param {number} Delta
 * @param {number} center
 * @param {Int32Array} V
 * @param {Function} eq
 * @param {number} lj
 * @param {number} rj
 */
const forwardExtend = (kMin, kMax, Delta, center, V, eq, lj, rj) => {
	const cMin = center + kMin;
	const cMax = center + kMax;
	const cx = center - Delta;
	for (let c = cMin; c <= cMax; c += 2) {
		const x = V[c];
		const y = x - (c - cx);
		V[c] = longestCommonPrefix(eq, x, lj, y, rj);
	}
};

export default forwardExtend;
