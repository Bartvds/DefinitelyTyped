/// <reference path="../_ref.d.ts" />

import Promise = require('bluebird');

import Test = require('./Test');
import TestResult = require('./TestResult');

/////////////////////////////////
// Parallel execute Tests
/////////////////////////////////
class TestQueue {

	private queue: Function[] = [];
	private active: Test[] = [];
	private concurrent: number;

	constructor(concurrent: number) {
		this.concurrent = Math.max(1, concurrent);
	}

	// add to queue and return a promise
	run(test: Test): Promise<TestResult> {
		var defer = Promise.defer();
		// add a closure to queue
		this.queue.push(() => {
			// run it
			var p = test.run();
			p.then(defer.resolve.bind(defer), defer.reject.bind(defer));
			p.finally(() => {
				var i = this.active.indexOf(test);
				if (i > -1) {
					this.active.splice(i, 1);
				}
				this.step();
			});
			// return it
			return test;
		});
		this.step();
		// defer it
		return defer.promise;
	}

	private step(): void {
		while (this.queue.length > 0 && this.active.length < this.concurrent) {
			this.active.push(this.queue.pop().call(null));
		}
	}
}

export = TestQueue;
