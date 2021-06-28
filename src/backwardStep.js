/**
 * Diagonal backward step.
 *
 * @param {{[x: number]: number}} V
 * @param {number} cMin
 * @param {number} cMax
 * @param {number} cmD
 */
export default function backwardStep(V, cMin, cMax, cmD) {
	V[cMin] =
		cMin === cmD
			? (V[(cMin + 1) | 0] - 1) | 0
			: Math.min(V[(cMin - 1) | 0], (V[(cMin + 1) | 0] - 1) | 0);

	for (let c = (cMin + 2) | 0; c < cMax; c = (c + 2) | 0) {
		V[c] = Math.min(V[(c - 1) | 0], (V[(c + 1) | 0] - 1) | 0);
	}

	if (cMin !== cMax) {
		// Assert(UB === D || V[cMax + 1] > V[cMax - 1]); // UB === D || xp > yp
		V[cMax] = V[(cMax - 1) | 0];
	}
}
