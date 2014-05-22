/// <reference path="../_ref.d.ts" />

import File = require('../file/File');

import TestResult = require('../test/TestResult');
import ITestSuite = require('../suite/ITestSuite');

import Tsc = require('../tsc/Tsc');
import exec = require('../util/exec');
import ITscExecOptions = require('../tsc/ITscExecOptions');

/////////////////////////////////
// Single test
/////////////////////////////////
class Test {
	constructor(public suite: ITestSuite, public tsfile: File, public options?: ITscExecOptions) {
	}

	public run(): Promise<TestResult> {
		return Tsc.run(this.tsfile.filePathWithName, this.options).then((execResult: exec.ExecResult) => {
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

export = Test;
