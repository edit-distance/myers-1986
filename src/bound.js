/**
 * Bound.
 *
 * @param {number} D
 * @param {number} N
 * @return {number}
 */
const bound = (D, N) => (D <= N ? D : 2 * N - D);
export default bound;
