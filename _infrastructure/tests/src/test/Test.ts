/// <reference path="../references.ts" />

import Tsc = require('../util/Tsc');

import file = require('../data/File');
import Print = require('../util/Print');

import ITestSuite = require('../test/ITestSuite');
import ITestReporter = require('../test/ITestReporter');
import ITestRunnerOptions = require('../test/ITestRunnerOptions');

import ITscExecOptions = require('../util/ITscExecOptions');

/////////////////////////////////
// Test result
/////////////////////////////////
export class TestResult {
	hostedBy: ITestSuite;
	targetFile: File;
	options: ITscExecOptions;

	stdout: string;
	stderr: string;
	exitCode: number;

	public get success(): boolean {
		return this.exitCode === 0;
	}
}

/////////////////////////////////
// Single test
/////////////////////////////////
export class Test {
	constructor(public suite: ITestSuite, public tsfile: File, public options?: ITscExecOptions) {
	}

	public run(): Promise<TestResult> {
		return Tsc.run(this.tsfile.filePathWithName, this.options).then((execResult: ExecResult) => {
			var testResult = new TestResult();
			testResult.hostedBy = this.suite;
			testResult.targetFile = this.tsfile;
			testResult.options = this.options;

			testResult.stdout = execResult.stdout;
			testResult.stderr = execResult.stderr;
			testResult.exitCode = execResult.exitCode;

			return testResult;
		});
	}
}

/////////////////////////////////
// Parallel execute Tests
/////////////////////////////////
export class TestQueue {

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
			// when activate, add test to active list
			this.active.push(test);
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
		});
		this.step();
		// defer it
		return defer.promise;
	}

	private step(): void {
		// setTimeout to make it flush
		setTimeout(() => {
			while (this.queue.length > 0 && this.active.length < this.concurrent) {
				this.queue.pop().call(null);
			}
		}, 1);
	}
}

