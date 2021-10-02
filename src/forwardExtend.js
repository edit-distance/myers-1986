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
export default function forwardExtend(cMin, cMax, cx, V, eq, lj, rj) {
	for (let c = cMin; c <= cMax; c = (c + 2) | 0) {
		V[c] = longestCommonPrefix(
			eq,
			V[c] | 0,
			lj,
			((V[c] | 0) - ((c - cx) | 0)) | 0,
			rj,
		);
	}
}
