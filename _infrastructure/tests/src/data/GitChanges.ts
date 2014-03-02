/// <reference path="../references.ts" />

import fs = require('fs');
import path = require('path');
import Promise = require('bluebird');

var Git = require('git-wrapper');

export = GitChanges;

class GitChanges {
	git;
	options = {};

	constructor(dtPath: string) {
		var dir = path.join(dtPath, '.git');
		if (!fs.existsSync(dir)) {
			throw new Error('cannot locate git-dir: ' + dir);
		}
		this.options['git-dir'] = dir;

		this.git = new Git(this.options);
		this.git.exec = Promise.promisify(this.git.exec);
	}

	public readChanges(): Promise<string[]> {
		var opts = {};
		var args = ['--name-only HEAD~1'];
		return this.git.exec('diff', opts, args).then((msg: string) => {
			return msg.replace(/^\s+/, '').replace(/\s+$/, '').split(/\r?\n/g);
		});
	}
}
