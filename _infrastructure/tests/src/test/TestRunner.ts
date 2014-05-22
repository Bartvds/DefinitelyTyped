/// <reference path="../_ref.d.ts" />

import Lazy = require('lazy.js');
import Promise = require('bluebird');

import Const = require('../Const');

import Timer = require('../util/Timer');
import GitChanges = require('../util/GitChanges');
import ITestSuite = require('../suite/ITestSuite');

import Print = require('../Print');
import FileIndex = require('../file/FileIndex');
import ITestRunnerOptions = require('../test/ITestRunnerOptions');

/////////////////////////////////
// The main class to kick things off
/////////////////////////////////
class TestRunner {
	private timer: Timer;
	private suites: ITestSuite[] = [];

	public changes: GitChanges;
	public index: FileIndex;
	public print: Print;

	constructor(public dtPath: string, public options: ITestRunnerOptions = {tscVersion: Const.DEFAULT_TSC_VERSION}) {
		this.options.findNotRequiredTscparams = !!this.options.findNotRequiredTscparams;

		this.index = new FileIndex(this, this.options);
		this.changes = new GitChanges(dtPath);

		this.print = new Print(this.options.tscVersion);
	}

	public addSuite(suite: ITestSuite): void {
		this.suites.push(suite);
	}

	public checkAcceptFile(fileName: string): boolean {
		var ok = tsExp.test(fileName);
		ok = ok && fileName.indexOf('_infrastructure') < 0;
		ok = ok && fileName.indexOf('node_modules/') < 0;
		ok = ok && /^[a-z]/i.test(fileName);
		return ok;
	}

	public run(): Promise<boolean> {
		this.timer = new Timer();
		this.timer.start();

		this.print.printChangeHeader();

		// only includes .d.ts or -tests.ts or -test.ts or .ts
		return this.index.readIndex().then(() => {
			return this.changes.readChanges();
		}).then((changes: string[]) => {
			this.print.printAllChanges(changes);
			return this.index.collectDiff(changes);
		}).then(() => {
			this.print.printRemovals(this.index.removed);
			this.print.printRelChanges(this.index.changed);
			return this.index.parseFiles();
		}).then(() => {
			if (this.options.printRefMap) {
				this.print.printRefMap(this.index, this.index.refMap);
			}
			if (Lazy(this.index.missing).some((arr: any[]) => arr.length > 0)) {
				this.print.printMissing(this.index, this.index.missing);
				this.print.printBoldDiv();
				// bail
				return Promise.cast(false);
			}
			if (this.options.printFiles) {
				this.print.printFiles(this.index.files);
			}
			return this.index.collectTargets().then((files) => {
				if (this.options.testChanges) {
					this.print.printQueue(files);
					return this.runTests(files);
				}
				else {
					this.print.printTestAll();
					return this.runTests(this.index.files)
				}
			}).then(() => {
				return !this.suites.some((suite) => {
					return suite.ngTests.length !== 0
				});
			});
		});
	}

	private runTests(files: File[]): Promise<boolean> {
		return Promise.attempt(() => {
			assert(Array.isArray(files), 'files must be array');

			var syntaxChecking = new SyntaxChecking(this.options);
			var testEval = new TestEval(this.options);

			if (!this.options.findNotRequiredTscparams) {
				this.addSuite(syntaxChecking);
				this.addSuite(testEval);
			}

			return Promise.all([
				syntaxChecking.filterTargetFiles(files),
				testEval.filterTargetFiles(files)
			]);
		}).spread((syntaxFiles, testFiles) => {
			this.print.init(syntaxFiles.length, testFiles.length, files.length);
			this.print.printHeader(this.options);

			if (this.options.findNotRequiredTscparams) {
				this.addSuite(new FindNotRequiredTscparams(this.options, this.print));
			}

			return Promise.reduce(this.suites, (count, suite: ITestSuite) => {
				suite.testReporter = suite.testReporter || new DefaultTestReporter(this.print);

				this.print.printSuiteHeader(suite.testSuiteName);

				if (this.options.skipTests) {
					this.print.printWarnCode('skipped test');
					return Promise.cast(count++);
				}

				return suite.start(files, (testResult) => {
					this.print.printTestComplete(testResult);
				}).then((suite) => {
					this.print.printSuiteComplete(suite);
					return count++;
				});
			}, 0);
		}).then((count) => {
			this.timer.end();
			this.finaliseTests(files);
		});
	}

	private finaliseTests(files: File[]): void {
		var testEval: TestEval = Lazy(this.suites).filter((suite) => {
			return suite instanceof TestEval;
		}).first();

		if (testEval) {
			var existsTestTypings: string[] = Lazy(testEval.testResults).map((testResult) => {
				return testResult.targetFile.dir;
			}).reduce((a: string[], b: string) => {
				return a.indexOf(b) < 0 ? a.concat([b]) : a;
			}, []);

			var typings: string[] = Lazy(files).map((file) => {
				return file.dir;
			}).reduce((a: string[], b: string) => {
				return a.indexOf(b) < 0 ? a.concat([b]) : a;
			}, []);

			var withoutTestTypings: string[] = typings.filter((typing) => {
				return existsTestTypings.indexOf(typing) < 0;
			});

			this.print.printDiv();
			this.print.printTypingsWithoutTest(withoutTestTypings);
		}

		this.print.printDiv();
		this.print.printTotalMessage();

		this.print.printDiv();
		this.print.printElapsedTime(this.timer.asString, this.timer.time);

		this.suites.filter((suite: ITestSuite) => {
			return suite.printErrorCount;
		}).forEach((suite: ITestSuite) => {
			this.print.printSuiteErrorCount(suite.errorHeadline, suite.ngTests.length, suite.testResults.length);
		});
		if (testEval) {
			this.print.printSuiteErrorCount('Without tests', withoutTestTypings.length, typings.length, true);
		}

		this.print.printDiv();

		if (this.suites.some((suite) => {
			return suite.ngTests.length !== 0
		})) {
			this.print.printErrorsHeader();

			this.suites.filter((suite) => {
				return suite.ngTests.length !== 0;
			}).forEach((suite) => {
				suite.ngTests.forEach((testResult) => {
					this.print.printErrorsForFile(testResult);
				});
				this.print.printBoldDiv();
			});
		}
	}
}

export = TestRunner;
