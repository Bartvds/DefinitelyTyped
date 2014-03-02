/// <reference path="../references.ts" />

import test = require('test');
import ITestReporter = require('ITestReporter');
import Print = require('../util/Print');

export = DefaultTestReporter;

/////////////////////////////////
// Default test reporter
/////////////////////////////////
class DefaultTestReporter implements ITestReporter {

	index = 0;

	constructor(public print: Print) {
	}

	public printPositiveCharacter(testResult: test.TestResult) {
		this.print.out('\33[36m\33[1m' + '.' + '\33[0m');
		this.index++;
		this.printBreakIfNeeded(this.index);
	}

	public printNegativeCharacter(testResult: test.TestResult) {
		this.print.out('x');
		this.index++;
		this.printBreakIfNeeded(this.index);
	}

	private printBreakIfNeeded(index: number) {
		if (index % this.print.WIDTH === 0) {
			this.print.break();
		}
	}
}
