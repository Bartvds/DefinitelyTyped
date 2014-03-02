/// <reference path="../references.ts" />

import test = require('test');

export = ITestReporter

/////////////////////////////////
// Test reporter interface
// for example, . and x
/////////////////////////////////
interface ITestReporter {
	printPositiveCharacter(testResult: test.TestResult):void;
	printNegativeCharacter(testResult: test.TestResult):void;
}
