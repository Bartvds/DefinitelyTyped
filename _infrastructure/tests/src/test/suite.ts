/// <reference path="../references.ts" />

import Promise = require('bluebird');

import util = require('../util/util');
import Print = require('../util/Print');
import Timer = require('../util/Timer');

import test = require('../test/test');

import ITestRunnerOptions = require('../test/ITestRunnerOptions');
import ITestReporter = require('../test/ITestReporter');
import ITestSuite = require('../test/ITestSuite');

var endDts = /\w\.ts$/i;

/////////////////////////////////
// Base class for test suite
/////////////////////////////////
export class TestSuiteBase implements ITestSuite {
	timer: Timer = new Timer();
	testResults: test.TestResult[] = [];
	testReporter: ITestReporter;
	printErrorCount = true;
	queue: test.TestQueue;

	constructor(public options: ITestRunnerOptions, public testSuiteName: string, public errorHeadline: string) {
		this.queue = new test.TestQueue(options.concurrent);
	}

	public filterTargetFiles(files: File[]): Promise<File[]> {
		throw new Error('please implement this method');
	}

	public start(targetFiles: File[], testCallback: (result: test.TestResult) => void): Promise<ITestSuite> {
		this.timer.start();

		return this.filterTargetFiles(targetFiles).then((targetFiles) => {
			// tests get queued for multi-threading
			return Promise.all(targetFiles.map((targetFile) => {
				return this.runTest(targetFile).then((result) => {
					testCallback(result);
				});
			}));
		}).then(() => {
			this.timer.end();
			return this;
		});
	}

	public runTest(targetFile: File): Promise<test.TestResult> {
		return this.queue.run(new test.Test(this, targetFile, {
			tscVersion: this.options.tscVersion
		})).then((result) => {
			this.testResults.push(result);
			return result;
		});
	}

	public get okTests(): TestResult[] {
		return this.testResults.filter((r) => {
			return r.success;
		});
	}

	public get ngTests(): TestResult[] {
		return this.testResults.filter((r) => {
			return !r.success
		});
	}
}

/////////////////////////////////
// Try compile without .tscparams
// It may indicate that it is compatible with --noImplicitAny maybe...
/////////////////////////////////
export class FindNotRequiredTscparams extends TestSuiteBase {
	testReporter: ITestReporter;
	printErrorCount = false;

	constructor(options: ITestRunnerOptions, private print: Print) {
		super(options, 'Find not required .tscparams files', 'New arrival!');

		this.testReporter = {
			printPositiveCharacter: (testResult: TestResult) => {
				this.print.clearCurrentLine().typingsWithoutTestName(testResult.targetFile.filePathWithName);
			},
			printNegativeCharacter: (testResult: TestResult) => {
			}
		}
	}

	public filterTargetFiles(files: File[]): Promise<File[]> {
		return Promise.filter(files, (file) => {
			return util.fileExists(file.filePathWithName + '.tscparams');
		});
	}

	public runTest(targetFile: File): Promise<TestResult> {
		this.print.clearCurrentLine().out(targetFile.filePathWithName);

		return this.queue.run(new test.Test(this, targetFile, {
			tscVersion: this.options.tscVersion,
			useTscParams: false,
			checkNoImplicitAny: true
		})).then((result) => {
			this.testResults.push(result);
			this.print.clearCurrentLine();
			return result
		});
	}

	public get ngTests(): TestResult[] {
		// Do not show ng test results
		return [];
	}
}

/////////////////////////////////
// .d.ts syntax inspection
/////////////////////////////////
export class SyntaxChecking extends TestSuiteBase {

	constructor(options: ITestRunnerOptions) {
		super(options, 'Syntax checking', 'Syntax error');
	}

	public filterTargetFiles(files: File[]): Promise<File[]> {
		return Promise.cast(files.filter((file) => {
			return endDts.test(file.filePathWithName);
		}));
	}
}

/////////////////////////////////
// Compile with *-tests.ts
/////////////////////////////////
export class TestEval extends TestSuiteBase {

	constructor(options) {
		super(options, 'Typing tests', 'Failed tests');
	}

	public filterTargetFiles(files: File[]): Promise<File[]> {
		return Promise.cast(files.filter((file) => {
			return endTestDts.test(file.filePathWithName);
		}));
	}
}
