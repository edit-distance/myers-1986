import makeScan32 from './makeScan32.js';
import int32 from './int32.js';

/**
 * MakeScan.
 *
 * @param {Function} method
 * @return {Function}
 */
export default function makeScan(method) {
	const scan32 = makeScan32(method);

	/**
	 * Returns distance, or -1 if distance > MAX.
	 * Throws if indices are not int32.
	 *
	 * @param {number} MAX
	 * @param {Function} eq
	 * @param {number} li
	 * @param {number} lj
	 * @param {number} ri
	 * @param {number} rj
	 * @return {number}
	 */
	const scan = (MAX, eq, li, lj, ri, rj) => {
		return scan32(int32(MAX), eq, int32(li), int32(lj), int32(ri), int32(rj));
	};

	return scan;
}
