/// <reference path="../_ref.d.ts" />

'use strict';

import Promise = require('bluebird');

import File = require('../file/File');
import TestSuiteBase = require('../suite/TestSuiteBase');

var endTestDts = /\w-tests?\.ts$/i;

/////////////////////////////////
// Compile with *-tests.ts
/////////////////////////////////
class TestEval extends TestSuiteBase {

	constructor(options) {
		super(options, 'Typing tests', 'Failed tests');
	}

	public filterTargetFiles(files: File[]): Promise<File[]> {
		return Promise.cast(files.filter((file) => {
			return endTestDts.test(file.filePathWithName);
		}));
	}
}

export = TestEval;
