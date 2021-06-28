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
		cMin === cmD ? V[cMin + 1] - 1 : Math.min(V[cMin - 1], V[cMin + 1] - 1);

	for (let c = cMin + 2; c < cMax; c += 2) {
		V[c] = Math.min(V[c - 1], V[c + 1] - 1);
	}

	if (cMin !== cMax) {
		// Assert(UB === D || V[cMax + 1] > V[cMax - 1]); // UB === D || xp > yp
		V[cMax] = V[cMax - 1];
	}
}
