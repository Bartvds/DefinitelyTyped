/// <reference path="../references.ts" />

export = ITestRunnerOptions;

interface ITestRunnerOptions {
	tscVersion:string;
	concurrent?:number;
	testChanges?:boolean;
	skipTests?:boolean;
	printFiles?:boolean;
	printRefMap?:boolean;
	findNotRequiredTscparams?:boolean;
}
