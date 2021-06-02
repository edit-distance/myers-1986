/**
 * BoundAlloc.
 *
 * TODO Remove Math.max(..., 1) since we skip D=0 now?
 *
 * @param {number} MAX
 * @param {number} li
 * @param {number} lj
 */
const boundAlloc = (MAX, li, lj) => Math.min(MAX, Math.max(lj - li, 1));

export default boundAlloc;
