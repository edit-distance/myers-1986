import assert from 'assert';

import StackEntry from './StackEntry.js';
import recurseDeeperStep from './recurseDeeperStep.js';

export default class RecurseDeeper {
	/**
	 *
	 * @param {Int32Array} V
	 * @param {StackEntry[]} stack
	 * @param {Function} eq
	 */
	constructor(V, stack, eq) {
		this.V = V;
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
		assert(this._stack[this._stack.length - 1] instanceof StackEntry);
		return {
			done: false,
			value: recurseDeeperStep(this.V, this._stack, this._eq),
		};
	}
}
