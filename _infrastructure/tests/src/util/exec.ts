/// <reference path="../references.ts" />

import Promise = require('bluebird');
import cp = require('child_process');

export class ExecResult {
	error;
	stdout = '';
	stderr = '';
	exitCode: number;
}

export function run(filename: string, cmdLineArgs: string[]): Promise<ExecResult> {
	return new Promise<ExecResult>((resolve) => {
		var result = new ExecResult();
		result.exitCode = null;

		var cmdLine = filename + ' ' + cmdLineArgs.join(' ');

		cp.exec(cmdLine, {maxBuffer: 1 * 1024 * 1024}, (error: Error, stdout: NodeBuffer, stderr: NodeBuffer) => {
			result.error = error;
			result.stdout = String(stdout);
			result.stderr = String(stderr);
			result.exitCode = error ? error['code'] : 0;
			resolve(result);
		});
	});
}
