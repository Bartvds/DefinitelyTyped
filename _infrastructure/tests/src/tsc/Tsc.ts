/// <reference path='../_ref.d.ts' />

'use strict';

import fs = require('fs');
import Promise = require('bluebird');

import Const = require('../Const');
import exec = require('../util/exec');
import util = require('../util/util');
import ITscExecOptions = require('./ITscExecOptions');

class Tsc {
	public static run(tsfile: string, options: ITscExecOptions): Promise<exec.ExecResult> {
		var tscPath;
		return new Promise.attempt(() => {
			options = options || {};
			options.tscVersion = options.tscVersion || Const.DEFAULT_TSC_VERSION;

			if (typeof options.checkNoImplicitAny === 'undefined') {
				options.checkNoImplicitAny = true;
			}
			if (typeof options.useTscParams === 'undefined') {
				options.useTscParams = true;
			}
			return util.fileExists(tsfile);
		}).then((exists) => {
			if (!exists) {
				throw new Error(tsfile + ' does not exist');
			}
			tscPath = './_infrastructure/tests/typescript/' + options.tscVersion + '/tsc.js';
			return util.fileExists(tscPath);
		}).then((exists) => {
			if (!exists) {
				throw new Error(tscPath + ' does not exist');
			}
			return util.fileExists(tsfile + '.tscparams');
		}).then(exists => {
			if (exists) {
				return util.readFile(tsfile + '.tscparams');
			} else {
				return Promise.resolve('');
			}
		}).then((paramContents: string) => {
			var command = 'node ' + tscPath + ' --module commonjs ';
			if (options.useTscParams && paramContents.trim() !== '' && paramContents.trim() !== '""') {
				command += '@' + tsfile + '.tscparams';
			}
			else if (options.checkNoImplicitAny) {
				command += '--noImplicitAny';
			}
			return exec(command, [tsfile]);
		});
	}
}

export  = Tsc;
