/// <reference path="../references.ts" />

import os = require('os');

import file = require('../data/File');
import test = require('../test/test');
import FileIndex = require('../data/FileIndex');
import ITestRunnerOptions = require('../test/ITestRunnerOptions');
import ITestSuite = require('../test/ITestSuite');

export = Print;

/////////////////////////////////
// All the common things that we print are functions of this class
/////////////////////////////////
class Print {

	WIDTH = 77;

	typings: number;
	tests: number;
	tsFiles: number

	constructor(public version: string){

	}

	public init(typings: number, tests: number, tsFiles: number) {
		this.typings = typings;
		this.tests = tests;
		this.tsFiles = tsFiles;
	}

	public out(s: any): Print {
		process.stdout.write(s);
		return this;
	}

	public repeat(s: string, times: number): string {
		return new Array(times + 1).join(s);
	}

	public changeHeader() {
		this.out('=============================================================================\n');
		this.out('                    \33[36m\33[1mDefinitelyTyped Diff Detector 0.1.0\33[0m \n');
		this.out('=============================================================================\n');
	}

	public header(options: ITestRunnerOptions) {
		var totalMem = Math.round(os.totalmem() / 1024 / 1024)  + ' mb';
		var freemem = Math.round(os.freemem() / 1024 / 1024)  + ' mb';

		this.out('=============================================================================\n');
		this.out('                    \33[36m\33[1mDefinitelyTyped Test Runner 0.5.0\33[0m\n');
		this.out('=============================================================================\n');
		this.out(' \33[36m\33[1mTypescript version:\33[0m ' + this.version + '\n');
		this.out(' \33[36m\33[1mTypings           :\33[0m ' + this.typings + '\n');
		this.out(' \33[36m\33[1mTests             :\33[0m ' + this.tests + '\n');
		this.out(' \33[36m\33[1mTypeScript files  :\33[0m ' + this.tsFiles + '\n');
		this.out(' \33[36m\33[1mTotal Memory      :\33[0m ' + totalMem + '\n');
		this.out(' \33[36m\33[1mFree Memory       :\33[0m ' + freemem + '\n');
		this.out(' \33[36m\33[1mCores             :\33[0m ' + os.cpus().length + '\n');
		this.out(' \33[36m\33[1mConcurrent        :\33[0m ' + options.concurrent + '\n');
	}

	public suiteHeader(title: string) {
		var left = Math.floor((this.WIDTH - title.length ) / 2) - 1;
		var right = Math.ceil((this.WIDTH - title.length ) / 2) - 1;
		this.out(this.repeat('=', left)).out(' \33[34m\33[1m');
		this.out(title);
		this.out('\33[0m ').out(this.repeat('=', right)).break();
	}

	public div() {
		this.out('-----------------------------------------------------------------------------\n');
	}

	public boldDiv() {
		this.out('=============================================================================\n');
	}

	public errorsHeader() {
		this.out('=============================================================================\n');
		this.out('                    \33[34m\33[1mErrors in files\33[0m \n');
		this.out('=============================================================================\n');
	}

	public errorsForFile(testResult: test.TestResult) {
		this.out('----------------- For file:' + testResult.targetFile.filePathWithName);
		this.break().out(testResult.stderr).break();
	}

	public break(): Print {
		this.out('\n');
		return this;
	}

	public clearCurrentLine(): Print {
		this.out('\r\33[K');
		return this;
	}

	public successCount(current: number, total: number) {
		var arb = (total === 0) ? 0 : (current / total);
		this.out(' \33[36m\33[1mSuccessful      :\33[0m \33[32m\33[1m' + (arb * 100).toFixed(2) + '% (' + current + '/' + total + ')\33[0m\n');
	}

	public failedCount(current: number, total: number) {
		var arb = (total === 0) ? 0 : (current / total);
		this.out(' \33[36m\33[1mFailure         :\33[0m \33[31m\33[1m' + (arb * 100).toFixed(2) + '% (' + current + '/' + total + ')\33[0m\n');
	}

	public typingsWithoutTestsMessage() {
		this.out(' \33[36m\33[1mTyping without tests\33[0m\n');
	}

	public totalMessage() {
		this.out(' \33[36m\33[1mTotal\33[0m\n');
	}

	public elapsedTime(time: string, s: number) {
		this.out(' \33[36m\33[1mElapsed time    :\33[0m ~' + time + ' (' + s + 's)\n');
	}

	public suiteErrorCount(errorHeadline: string, current: number, total: number, warn: boolean = false) {
		var arb = (total === 0) ? 0 : (current / total);
		this.out(' \33[36m\33[1m').out(errorHeadline).out(this.repeat(' ', 16 - errorHeadline.length));
		if (warn) {
			this.out(': \33[31m\33[1m' + (arb * 100).toFixed(2) + '% (' + current + '/' + total + ')\33[0m\n');
		}
		else {
			this.out(': \33[33m\33[1m' + (arb * 100).toFixed(2) + '% (' + current + '/' + total + ')\33[0m\n');
		}
	}

	public subHeader(file: string) {
		this.out(' \33[36m\33[1m' + file + '\33[0m\n');
	}

	public warnCode(str: string) {
		this.out(' \33[31m\33[1m<' + str.toLowerCase().replace(/ +/g, '-') + '>\33[0m\n');
	}

	public printLine(file: string) {
		this.out(file + '\n');
	}

	public element(file: string) {
		this.out(' - ' + file + '\n');
	}

	public element2(file: string) {
		this.out('    - ' + file + '\n');
	}

	public typingsWithoutTestName(file: string) {
		this.out(' - \33[33m\33[1m' + file + '\33[0m\n');
	}

	public typingsWithoutTest(withoutTestTypings: string[]) {
		if (withoutTestTypings.length > 0) {
			this.typingsWithoutTestsMessage();

			this.div();
			withoutTestTypings.forEach((t) => {
				this.typingsWithoutTestName(t);
			});
		}
	}

	public testComplete(testResult: test.TestResult): void {
		var reporter = testResult.hostedBy.testReporter;
		if (testResult.success) {
			reporter.printPositiveCharacter(testResult);
		}
		else {
			reporter.printNegativeCharacter(testResult);
		}
	}

	public suiteComplete(suite: ITestSuite): void {
		this.break();

		this.div();
		this.elapsedTime(suite.timer.asString, suite.timer.time);
		this.successCount(suite.okTests.length, suite.testResults.length);
		this.failedCount(suite.ngTests.length, suite.testResults.length);
	}

	public testing(adding: FileDict): void {
		this.div();
		this.subHeader('Testing');
		this.div();

		Object.keys(adding).sort().map((src) => {
			this.printLine(adding[src].filePathWithName);
			return adding[src];
		});
	}

	public printQueue(files: File[]): void {
		this.div();
		this.subHeader('Queued for testing');
		this.div();

		files.forEach((file) => {
			this.printLine(file.filePathWithName);
		});
	}

	public testAll(): void {
		this.div();
		this.subHeader('Ignoring changes, testing all files');
	}

	public files(files: File[]): void {
		this.div();
		this.subHeader('Files');
		this.div();

		files.forEach((file) => {
			this.printLine(file.filePathWithName);
			file.references.forEach((file) => {
				this.element(file.filePathWithName);
			});
		});
	}

	public missing(index: FileIndex, refMap: FileArrDict): void {
		this.div();
		this.subHeader('Missing references');
		this.div();

		Object.keys(refMap).sort().forEach((src) => {
			var ref = index.getFile(src);
			this.printLine('\33[31m\33[1m' + ref.filePathWithName + '\33[0m');
			refMap[src].forEach((file) => {
				this.element(file.filePathWithName);
			});
		});
	}

	public allChanges(paths: string[]): void {
		this.subHeader('All changes');
		this.div();

		paths.sort().forEach((line) => {
			this.printLine(line);
		});
	}

	public relChanges(changeMap: FileDict): void {
		this.div();
		this.subHeader('Interesting files');
		this.div();

		Object.keys(changeMap).sort().forEach((src) => {
			this.printLine(changeMap[src].filePathWithName);
		});
	}

	public removals(changeMap: FileDict): void {
		this.div();
		this.subHeader('Removed files');
		this.div();

		Object.keys(changeMap).sort().forEach((src) => {
			this.printLine(changeMap[src].filePathWithName);
		});
	}

	public refMap(index: FileIndex, refMap: FileArrDict): void {
		this.div();
		this.subHeader('Referring');
		this.div();

		Object.keys(refMap).sort().forEach((src) => {
			var ref = index.getFile(src);
			this.printLine(ref.filePathWithName);
			refMap[src].forEach((file) => {
				this.printLine(' - ' + file.filePathWithName);
			});
		});
	}
}
