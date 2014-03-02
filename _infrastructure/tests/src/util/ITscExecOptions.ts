/// <reference path="../references.ts" />

export = ITscExecOptions;

interface ITscExecOptions {
	tscVersion?: string;
	useTscParams?: boolean;
	checkNoImplicitAny?: boolean;
}
