import assert = require('assert');
import Promise = require('bluebird');

import Timer = require('../util/Timer');
import Print = require('../util/Print');
import file = require('../data/File');

import FileIndex = require('../data/FileIndex');
import GitChanges = require('../data/GitChanges');

import suite = require('../test/suite');
import ITestSuite = require('../test/ITestSuite');
/// <reference path="../references.ts" />

import ITestRunnerOptions = require('../test/ITestRunnerOptions');
import DefaultTestReporter = require('../test/DefaultTestReporter');

var tsExp = /\.ts$/;

/////////////////////////////////
// The main class to kick things off
/////////////////////////////////
export class TestRunner {
	private timer: Timer;
	private suites: test.ITestSuite[] = [];

	public changes: GitChanges;
	public index: FileIndex;
	public print: Print;

	constructor(public dtPath: string, public options: ITestRunnerOptions = {tscVersion: DEFAULT_TSC_VERSION}) {
		this.options.findNotRequiredTscparams = !!this.options.findNotRequiredTscparams;

		this.index = new FileIndex(this, this.options);
		this.changes = new GitChanges(this);

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

		this.print.changeHeader();

		// only includes .d.ts or -tests.ts or -test.ts or .ts
		return this.index.readIndex().then(() => {
			return this.changes.readChanges();
		}).then((changes: string[]) => {
			this.print.allChanges(changes);
			return this.index.collectDiff(changes);
		}).then(() => {
			this.print.removals(this.index.removed);
			this.print.relChanges(this.index.changed);
			return this.index.parseFiles();
		}).then(() => {
			if (this.options.printRefMap) {
				this.print.refMap(this.index, this.index.refMap);
			}
			if (Lazy(this.index.missing).some((arr: any[]) => arr.length > 0)) {
				this.print.missing(this.index, this.index.missing);
				this.print.boldDiv();
				// bail
				return Promise.cast(false);
			}
			if (this.options.printFiles) {
				this.print.files(this.index.files);
			}
			return this.index.collectTargets().then((files) => {
				if (this.options.testChanges) {
					this.print.printQueue(files);
					return this.runTests(files);
				}
				else {
					this.print.testAll();
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

			var syntaxChecking = new suite.SyntaxChecking(this.options);
			var testEval = new suite.TestEval(this.options);

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
			this.print.header(this.options);

			if (this.options.findNotRequiredTscparams) {
				this.addSuite(new suite.FindNotRequiredTscparams(this.options, this.print));
			}

			return Promise.reduce(this.suites, (count, suite: ITestSuite) => {
				suite.testReporter = suite.testReporter || new reporter.DefaultTestReporter(this.print);

				this.print.suiteHeader(suite.testSuiteName);

				if (this.options.skipTests) {
					this.print.warnCode('skipped test');
					return Promise.cast(count++);
				}

				return suite.start(files, (testResult) => {
					this.print.testComplete(testResult);
				}).then((suite) => {
					this.print.suiteComplete(suite);
					return count++;
				});
			}, 0);
		}).then((count) => {
			this.timer.end();
			this.finaliseTests(files);
		});
	}

	private finaliseTests(files: File[]): void {
		var testEval: suite.TestEval = Lazy(this.suites).filter((suite) => {
			return suite instanceof suite.TestEval;
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

			this.print.div();
			this.print.typingsWithoutTest(withoutTestTypings);
		}

		this.print.div();
		this.print.totalMessage();

		this.print.div();
		this.print.elapsedTime(this.timer.asString, this.timer.time);

		this.suites.filter((suite: ITestSuite) => {
			return suite.printErrorCount;
		}).forEach((suite: ITestSuite) => {
			this.print.suiteErrorCount(suite.errorHeadline, suite.ngTests.length, suite.testResults.length);
		});
		if (testEval) {
			this.print.suiteErrorCount('Without tests', withoutTestTypings.length, typings.length, true);
		}

		this.print.div();

		if (this.suites.some((suite) => {
			return suite.ngTests.length !== 0
		})) {
			this.print.errorsHeader();

			this.suites.filter((suite) => {
				return suite.ngTests.length !== 0;
			}).forEach((suite) => {
				suite.ngTests.forEach((testResult) => {
					this.print.errorsForFile(testResult);
				});
				this.print.boldDiv();
			});
		}
	}
}
