/// <reference path="../typings/tsd.d.ts" />

//grunt-start
/// <reference path="data/FileIndex.ts" />
/// <reference path="data/GitChanges.ts" />
/// <reference path="main.ts" />
/// <reference path="test/DefaultTestReporter.ts" />
/// <reference path="test/ITestReporter.ts" />
/// <reference path="test/ITestRunnerOptions.ts" />
/// <reference path="test/ITestSuite.ts" />
/// <reference path="test/TestRunner.ts" />
/// <reference path="test/suite.ts" />
/// <reference path="test/test.ts" />
/// <reference path="util/ITscExecOptions.ts" />
/// <reference path="util/Print.ts" />
/// <reference path="util/Timer.ts" />
/// <reference path="util/Tsc.ts" />
/// <reference path="util/exec.ts" />
/// <reference path="data/File.ts" />
/// <reference path="util/util.ts" />
//grunt-end

interface FileDict {
	[fullPath:string]: File;
}
interface FileArrDict {
	[fullPath:string]: File[];
}
