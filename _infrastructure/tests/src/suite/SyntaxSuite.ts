/// <reference path="../runner.ts" />
/// <reference path="../util.ts" />

'use strict';

import Promise = require('bluebird');

import File = require('../file/File');
import TestSuiteBase = require('./TestSuiteBase');
import ITestRunnerOptions = require('../test/ITestRunnerOptions');

var endDts = /\w\.d\.ts$/i;

/////////////////////////////////
// .d.ts syntax inspection
/////////////////////////////////
class SyntaxChecking extends TestSuiteBase {

	constructor(options: ITestRunnerOptions) {
		super(options, 'Syntax checking', 'Syntax error');
	}

	public filterTargetFiles(files: File[]): Promise<File[]> {
		return Promise.cast(files.filter((file) => {
			return endDts.test(file.filePathWithName);
		}));
	}
}

export = SyntaxChecking;
