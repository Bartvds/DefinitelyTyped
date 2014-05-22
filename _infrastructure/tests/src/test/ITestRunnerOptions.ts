interface ITestRunnerOptions {
	tscVersion:string;
	concurrent?:number;
	testChanges?:boolean;
	skipTests?:boolean;
	printFiles?:boolean;
	printRefMap?:boolean;
	findNotRequiredTscparams?:boolean;
}

export = ITestRunnerOptions;
