#! /usr/bin/env node
'use strict';

var VERSION = '0.2.0'; // @topthat

var chalk = require('chalk');
var nopt = require('nopt');
var topthat = require('../src/topthat');

var opts = nopt({
    dir: String,
    banner: [String, Array],
    files: [String, Array],
    version: Boolean
}, {
    v: '--version'
});

if (opts.version) {
    return console.log(chalk.blue('topthat, Version ' + VERSION));
}

var banner = opts.banner;
if (typeof banner === 'string') {
    banner = [banner];
}

var files = opts.files;
if (typeof files === 'string') {
    files = [files];
}

var updateType = opts.argv.remain[0];

if (!topthat.config({
    banner: banner,
    files: files,
    updateType: updateType
})) {
    return console.log(chalk.red('Failed to update: config error.'));
}

if (topthat.replaceFiles()) {
    console.log(chalk.green('Updated to version ') + 
            chalk.blue(topthat.nextVersion()) + 
            chalk.green(' from version ') + 
            chalk.blue(topthat.currentVersion()) +
            chalk.green('!')
    );
} else {
    console.log(chalk.red('Failed to upgrade.'));
}
