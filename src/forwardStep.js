import assert from 'assert';

/**
 * Diagonal forward step.
 *
 * @param {{[x: number]: number}} V
 * @param {number} cMin
 * @param {number} cMax
 * @param {number} cpD
 */
export default function forwardStep(V, cMin, cMax, cpD) {
	assert(cMin < cMax);
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
	V[cMin] = V[(cMin + 1) | 0] | 0;

	for (let c = (cMin + 2) | 0; c < cMax; c = (c + 2) | 0) {
		// Assert(c - center !== -D && c - center !== D);

		// Assert(x <= lj); // False sometimes
		// assert(y <= rj); // False sometimes
		// assert(x >= li); // Always true
		// assert(y >= ri); // Always true
		V[c] = Math.max(V[(c + 1) | 0] | 0, ((V[(c - 1) | 0] | 0) + 1) | 0);
	}

	// Assert(UB !== LB);

	// Assert(x <= lj); // False sometimes
	// assert(y <= rj); // Always true
	// assert(x >= li); // Always true
	// assert(y >= ri); // Always true
	V[cMax] =
		cMax === cpD
			? ((V[(cMax - 1) | 0] | 0) + 1) | 0
			: Math.max(V[(cMax + 1) | 0] | 0, ((V[(cMax - 1) | 0] | 0) + 1) | 0);
}
