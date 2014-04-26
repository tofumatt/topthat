#! /usr/bin/env node
'use strict';

var VERSION = '0.1.0';

var chalk = require('chalk');
var nopt = require('nopt');
var topthat = require('../src/topthat');

var opts = nopt({
    dir: String,
    version: Boolean
}, {
    v: '--version'
});

if (opts.version) {
    return console.log(chalk.blue('topthat, Version ' + VERSION));
}

var command = opts.argv.remain[0];

if (topthat.replaceFiles()) {

}

console.log(chalk.green('Upgraded to version ') + 
            chalk.blue(topthat.nextVersion()) + 
            chalk.green(' from version ') + 
            chalk.blue(topthat.currentVersion()) +
            chalk.green('!')
);
