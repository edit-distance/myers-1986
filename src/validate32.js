import {ValueError} from '@failure-abstraction/error';

/**
 * Validate input indices.
 *
 * @param {number} MAX
 * @param {number} li
 * @param {number} lj
 * @param {number} ri
 * @param {number} rj
 */
export default function validate32(MAX, li, lj, ri, rj) {
	if (!Number.isInteger(MAX)) {
		throw new ValueError();
	}

	if (MAX < -2147483648) {
		throw new ValueError();
	}

	if (MAX > 2147483647) {
		throw new ValueError();
	}

	if (!Number.isInteger(li)) {
		throw new ValueError();
	}

	if (li < -2147483648) {
		throw new ValueError();
	}

	if (li > 2147483647) {
		throw new ValueError();
	}

	if (!Number.isInteger(lj)) {
		throw new ValueError();
	}

	if (lj < -2147483648) {
		throw new ValueError();
	}

	if (lj > 2147483647) {
		throw new ValueError();
	}

	if (!Number.isInteger(ri)) {
		throw new ValueError();
	}

	if (ri < -2147483648) {
		throw new ValueError();
	}

	if (ri > 2147483647) {
		throw new ValueError();
	}

	if (!Number.isInteger(rj)) {
		throw new ValueError();
	}

	if (rj < -2147483648) {
		throw new ValueError();
	}

	if (rj > 2147483647) {
		throw new ValueError();
	}
}
