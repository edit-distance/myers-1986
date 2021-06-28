/**
 * Diagonal forward step.
 *
 * @param {{[x: number]: number}} V
 * @param {number} cMin
 * @param {number} cMax
 * @param {number} cpD
 */
export default function forwardStep(V, cMin, cMax, cpD) {
	// Assert(ri < rj && li < lj);
	// assert(LB <= UB);
	// assert(LB !== D);
	// assert(UB !== -D);

	// const yp = V[cMin + 1];
	// assert(LB === -D || V[cMin - 1] < V[cMin + 1]); // LB === -D || xp < yp
	// const x = yp;
	// Const y = x - (k + Delta);

	// assert(x <= lj); // Always true
	// Assert(y <= rj); // False sometimes
	// assert(x >= li); // Always true
	// assert(y >= ri); // Always true
	V[cMin] = V[cMin + 1];

	for (let c = cMin + 2; c < cMax; c += 2) {
		// Assert(c - center !== -D && c - center !== D);

		// Assert(x <= lj); // False sometimes
		// assert(y <= rj); // False sometimes
		// assert(x >= li); // Always true
		// assert(y >= ri); // Always true
		V[c] = Math.max(V[c + 1], V[c - 1] + 1);
	}

	if (cMin !== cMax) {
		// Assert(UB !== LB);

		// Assert(x <= lj); // False sometimes
		// assert(y <= rj); // Always true
		// assert(x >= li); // Always true
		// assert(y >= ri); // Always true
		V[cMax] =
			cMax === cpD ? V[cMax - 1] + 1 : Math.max(V[cMax + 1], V[cMax - 1] + 1);
	}
}
