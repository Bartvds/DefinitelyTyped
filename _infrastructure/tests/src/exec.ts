/// <reference path="stats/probe.ts" />

module DT {
	'use strict';

	var Promise: typeof Promise = require('bluebird');
	var nodeExec = require('child_process').exec;

	export class ExecResult {
		error;
		stdout = '';
		stderr = '';
		exitCode: number;
		attempts: number;
	}

	export function exec(filename: string, cmdLineArgs: string[]): Promise<ExecResult> {
		return new Promise((resolve) => {
			var result = new ExecResult();
			result.exitCode = null;

			var cmdLine = filename + ' ' + cmdLineArgs.join(' ');
			var maxAttempts = 4;
			var attempts = 0;

			var run = () => {
				attempts++;
				var cid = nodeExec(cmdLine, {maxBuffer: 1 * 1024 * 1024}, (error, stdout, stderr) => {
					var exitCode = (error ? error.code : 0);
					if (exitCode !== 0) {
						console.log('bad exit');
						console.log(result.stderr);
						console.log(attempts);
						console.log(exitCode);
						console.log((error ? error.code : 'XX'));
						console.log(error);
						console.log(typeof result.stderr);
						console.log(/^Killed/.test(String(result.stderr)));
						console.log(/Killed/.test(String(result.stderr)));
						console.log(/^Killed/.exec(String(result.stderr)));
						console.log(/Killed/.exec(String(result.stderr)));
					}
					if (exitCode !== 0 && result.stderr && /^Killed/.test(String(result.stderr)) && attempts < maxAttempts) {
						console.log('try again ' + attempts);
						// try again
						setTimeout(() => {
							run();
						}, attempts * 2000 + 2000);
						return;
					}
					result.attempts = attempts;
					result.error = error;
					result.stdout = stdout;
					result.stderr = stderr;
					result.exitCode = exitCode;
					resolve(result);
				});
				//monitor cid
			};
			run();
		});
	}
}
