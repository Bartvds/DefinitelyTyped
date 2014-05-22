
'use strict';

import Promise = require('bluebird');
import cp = require('child_process');

export class ExecResult {
	error;
	stdout = '';
	stderr = '';
	exitCode: number;
}

export function exec(filename: string, cmdLineArgs: string[]): Promise<ExecResult> {
	return new Promise((resolve) => {
		var result = new ExecResult();
		result.exitCode = null;

		var cmdLine = filename + ' ' + cmdLineArgs.join(' ');

		cp.exec(cmdLine, {maxBuffer: 1 * 1024 * 1024}, (error, stdout, stderr) => {
			result.error = error;
			result.stdout = String(stdout);
			result.stderr = String(stderr);
			result.exitCode = error ? error['code'] : 0;
			resolve(result);
		});
	});
}
