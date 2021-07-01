import assert from 'assert';

/**
 * Computes an upper bound for the signed distance.
 *
 * Note that lBound(D, N) = uBound(D, M) is possible if and only if we have
 * D = N + M and N >= 1 and M >= 1. Case analysis:
 *
 *  - D = -D NOT POSSIBLE SINCE D >= 1
 *  - D = D - M * 2 NOT POSSIBLE SINCE M >= 1
 *  - -D = N * 2 - D  NOT POSSIBLE SINCE N >= 1
 *  - D - M * 2 = N * 2 - D POSSIBLE ONLY IF D = N + M, D >= N + 1, and D >= M + 1.
 *
 *  Note that we only use lBound and uBound when this special case does not
 *  happen. This required some refactoring in oneWay to pull-out the case D = N
 *  + M. None was required in twoWayScan since we have the assertions
 *  2 * D <= MAX + parityDelta and MAX <= N + M.
 *
 * @see lBound
 *
 * @param {number} D >= 1
 * @param {number} N >= 1
 * @return {number} A number -D < k <= N.
 */
export default function uBound(D, N) {
	assert(N >= 1);
	assert(D >= 1);
	const k = D <= N ? D | 0 : ((N << 1) - D) | 0;
	assert(k <= N);
	assert(k > -D);
	assert((D & 1) === (k & 1));
	return k;
}
