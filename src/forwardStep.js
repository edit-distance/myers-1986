import assert from 'assert';

/**
 * Diagonal forward step.
 *
 * @param {number} center
 * @param {number} D
 * @param {{[x: number]: number}} V
 * @param {number} LB
 * @param {number} UB
 */
export default function forwardStep(center, D, V, LB, UB) {
	// Assert(ri < rj && li < lj);
	assert(LB <= UB);
	assert(LB !== D);
	assert(UB !== -D);

	const cx = center - 1;
	const cy = center + 1;

	const k = LB;
	const yp = V[cy + k];
	assert(k === -D || V[cx + k] < yp); // K === -D || xp < yp
	const x = yp;
	// Const y = x - (k + Delta);

	// assert(x <= lj); // Always true
	// Assert(y <= rj); // False sometimes
	// assert(x >= li); // Always true
	// assert(y >= ri); // Always true
	V[center + k] = x;

	for (let k = LB + 2; k < UB; k += 2) {
		assert(k !== -D && k !== D);
		const xp = V[cx + k];
		const yp = V[cy + k];
		const x = xp < yp ? yp : xp + 1;

		// Assert(x <= lj); // False sometimes
		// assert(y <= rj); // False sometimes
		// assert(x >= li); // Always true
		// assert(y >= ri); // Always true
		V[center + k] = x;
	}

	if (UB !== LB) {
		const k = UB;
		const xp = V[cx + k];
		const yp = V[cy + k];
		const x = k !== D && xp < yp ? yp : xp + 1;

		// Assert(x <= lj); // False sometimes
		// assert(y <= rj); // Always true
		// assert(x >= li); // Always true
		// assert(y >= ri); // Always true
		V[center + k] = x;
	}
}
