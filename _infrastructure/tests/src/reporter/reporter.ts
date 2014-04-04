/// <reference path="../../_ref.d.ts" />
/// <reference path="../printer.ts" />

module DT {
	/////////////////////////////////
	// Test reporter interface
	// for example, . and x
	/////////////////////////////////
	export interface ITestReporter {
		printPositiveCharacter(testResult: TestResult):void;
		printNegativeCharacter(testResult: TestResult):void;
	}

	/////////////////////////////////
	// Default test reporter
	/////////////////////////////////
	export class DefaultTestReporter implements ITestReporter {

		index = 0;

		constructor(public print: Print) {
		}

		public printPositiveCharacter(testResult: TestResult) {
			if (testResult.attempts > 1) {
				this.print.out('\33[32m\33[1m' + testResult.attempts.toString(16) + '\33[0m');
			}
			else {
				this.print.out('\33[36m\33[1m' + '.' + '\33[0m');
			}
			this.index++;
			this.printBreakIfNeeded(this.index);
		}

		public printNegativeCharacter( testResult: TestResult) {
			if (testResult.attempts > 1) {
				this.print.out('\33[31m\33[1m' + testResult.attempts.toString(16) + '\33[0m');
			}
			else {
				this.print.out('x');
			}
			this.index++;
			this.printBreakIfNeeded(this.index);
		}

		private printBreakIfNeeded(index: number) {
			if (index % this.print.WIDTH === 0) {
				this.print.printBreak();
			}
		}
	}
}
