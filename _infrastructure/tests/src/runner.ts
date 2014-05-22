/// <reference path="_ref.d.ts" />

import os = require('os');
import fs = require('fs');
import path = require('path');
import assert = require('assert');

import sms = require('source-map-support');
import Lazy = require('lazy.js');
import Promise = require('bluebird');
import opt = require('optimist');

import Const = require('./Const');
import TestRunner = require('./test/TestRunner');

sms.install();

var tsExp = /\.ts$/;

interface PackageJSON {
	scripts: {[key:string]: string};
}

var optimist = opt(process.argv);
optimist.default('try-without-tscparams', false);
optimist.default('single-thread', false);
optimist.default('tsc-version', Const.DEFAULT_TSC_VERSION);

optimist.default('test-changes', false);
optimist.default('skip-tests', false);
optimist.default('print-files', false);
optimist.default('print-refmap', false);

optimist.boolean('help');
optimist.describe('help', 'print help');
optimist.alias('h', 'help');

var argv: any = optimist.argv;

var dtPath = path.resolve(path.dirname((module).filename), '..', '..');
var cpuCores = os.cpus().length;

if (argv.help) {
	optimist.help();

	var pkg: PackageJSON = require('../../package.json');

	console.log('Scripts:');
	console.log('');
	Lazy(pkg.scripts).keys().each((key) => {
		console.log('   $ npm run ' + key);
	});
	process.exit(0);
}

var testFull = (process.env['TRAVIS_BRANCH'] ? /\w\/full$/.test(process.env['TRAVIS_BRANCH']) : false);

new TestRunner(dtPath, {
	concurrent: (argv['single-thread'] ? 1 : Math.max(Math.min(24, cpuCores), 2)),
	tscVersion: argv['tsc-version'],
	testChanges: (testFull ? false : argv['test-changes']), // allow magic branch
	skipTests: argv['skip-tests'],
	printFiles: argv['print-files'],
	printRefMap: argv['print-refmap'],
	findNotRequiredTscparams: argv['try-without-tscparam']
}).run().then((success) => {
	if (!success) {
		process.exit(1);
	}
}).catch((err) => {
	throw err;
	process.exit(2);
});
