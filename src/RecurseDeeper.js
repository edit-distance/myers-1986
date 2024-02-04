import assert from 'assert';

import StackEntry from './StackEntry.js';
import recurseDeeperStep from './recurseDeeperStep.js';

export default class RecurseDeeper {
	/**
	 *
	 * @param {Int8Array|Int16Array|Int32Array} B
	 * @param {StackEntry[]} stack
	 * @param {Function} eq
	 */
	constructor(B, stack, eq) {
		this.B = B;
		this._stack = stack;
		this._eq = eq;
	}

	[Symbol.iterator]() {
		return this;
	}

	/**
	 * @return {IteratorResult<number[]>}
	 */
	next() {
		if (this._stack.length === 0) return {done: true, value: undefined};
		assert(this._stack.at(-1) instanceof StackEntry);
		return {
			done: false,
			value: recurseDeeperStep(this.B, this._stack, this._eq),
		};
	}
}
