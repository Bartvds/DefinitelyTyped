/// <reference path="../runner.ts" />

'use strict';

import Promise = require('bluebird');

import ITestSuite = require('./ITestSuite');
import ITestRunnerOptions = require('../test/ITestRunnerOptions');
import ITestReporter = require('../reporter/ITestReporter');

import File = require('../file/File');

import Timer = require('../util/Timer');
import TestQueue = require('../test/TestQueue');
import TestResult = require('../test/TestResult');

/////////////////////////////////
// Base class for test suite
/////////////////////////////////
class TestSuiteBase implements ITestSuite {
	timer: Timer = new Timer();
	testResults: TestResult[] = [];
	testReporter: ITestReporter;
	printErrorCount = true;
	queue: TestQueue;

	constructor(public options: ITestRunnerOptions, public testSuiteName: string, public errorHeadline: string) {
		this.queue = new TestQueue(options.concurrent);
	}

	public filterTargetFiles(files: File[]): Promise<File[]> {
		throw new Error('please implement this method');
	}

	public start(targetFiles: File[], testCallback: (result: TestResult) => void): Promise<ITestSuite> {
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

	public runTest(targetFile: File): Promise<TestResult> {
		return this.queue.run(new Test(this, targetFile, {
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

export = TestSuiteBase;
