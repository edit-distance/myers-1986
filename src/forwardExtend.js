import longestCommonPrefix from './longestCommonPrefix.js';

/**
 * Diagonal forward extension subroutine.
 *
 * @param {number} cMin
 * @param {number} cMax
 * @param {number} cx
 * @param {{[x: number]: number}} V
 * @param {Function} eq
 * @param {number} lj
 * @param {number} rj
 */
const forwardExtend = (cMin, cMax, cx, V, eq, lj, rj) => {
	for (let c = cMin; c <= cMax; c += 2) {
		V[c] = longestCommonPrefix(eq, V[c], lj, V[c] - (c - cx), rj);
	}
};

export default forwardExtend;
