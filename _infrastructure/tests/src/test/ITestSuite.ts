/// <reference path="../references.ts" />
/*
import Promise = require('bluebird');
import Timer = require('../util/Timer');
import test = require('../test/test');

import ITestReporter = require('../test/DefaultTestReporter');

export = ITestSuite;
*/
/////////////////////////////////
// The interface for test suite
/////////////////////////////////
interface ITestSuite {
	testSuiteName:string;
	errorHeadline:string;
	filterTargetFiles(files: File[]): Promise<File[]>;

	start(targetFiles: File[], testCallback: (result: TestResult, index: number) => void): Promise<ITestSuite>;

	testResults:TestResult[];
	okTests:TestResult[];
	ngTests:TestResult[];
	timer:Timer;

	testReporter:ITestReporter;
	printErrorCount:boolean;
}
