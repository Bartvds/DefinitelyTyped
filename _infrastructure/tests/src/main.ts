/// <reference path="references.ts" />

import os = require('os');
import fs = require('fs');
import path = require('path');

import Promise= require('bluebird');
import sms = require('source-map-support');
import optimist = require('optimist');

import TestRunner = require('./test/TestRunner');

sms.install();

export var DEFAULT_TSC_VERSION = '0.9.7';

optimist(process.argv);
optimist.default('try-without-tscparams', false);
optimist.default('single-thread', false);
optimist.default('tsc-version', DEFAULT_TSC_VERSION);

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
	optimist.showHelp();
	process.exit(0);
}

new TestRunner(dtPath, {
	concurrent: argv['single-thread'] ? 1 : Math.max(cpuCores, 2),
	tscVersion: argv['tsc-version'],
	testChanges: argv['test-changes'],
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
