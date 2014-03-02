/// <reference path="../references.ts" />

import fs = require('fs');
import Promise = require('bluebird');
import file = require('../data/File');
import exec = require('../util/exec');
import util = require('../util/util');
import ITscExecOptions = require('../util/ITscExecOptions');

export function run(tsfile: string, options: ITscExecOptions): Promise<exec.ExecResult> {
	var tscPath;
	return Promise.attempt(() => {
		options = options || {};
		// options.tscVersion = options.tscVersion || DEFAULT_TSC_VERSION;
		if (typeof options.checkNoImplicitAny === 'undefined') {
			options.checkNoImplicitAny = true;
		}
		if (typeof options.useTscParams === 'undefined') {
			options.useTscParams = true;
		}
		return file.exists(tsfile);
	}).then((exists) => {
		if (!exists) {
			throw new Error(tsfile + ' not exists');
		}
		tscPath = './_infrastructure/tests/typescript/' + options.tscVersion + '/tsc.js';
		return file.exists(tscPath);
	}).then((exists) => {
		if (!exists) {
			throw new Error(tscPath + ' is not exists');
		}
		return file.exists(tsfile + '.tscparams');
	}).then((exists) => {
		var command = 'node ' + tscPath + ' --module commonjs ';
		if (options.useTscParams && exists) {
			command += '@' + tsfile + '.tscparams';
		}
		else if (options.checkNoImplicitAny) {
			command += '--noImplicitAny';
		}
		return exec.run(command, [tsfile]);
	});
}
