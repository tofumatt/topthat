var fs = require('fs');
var path = require('path');
var semver = require('semver');
var template = require('./template');

var BANNER = '/*!\n' +
             '    {{name}} -- {{description}}\n' +
             '    Version {{version}}\n' +
             '    {{homepage}}{{url}}\n' +
             '    (c) {{year}} {{author}}, {{licence}}{{license}}\n' +
             '*/\n';

var FILES_TO_ALWAYS_UPDATE = ['bower.json', 'package.json'];

var MAJOR_UPDATE_SHORTHANDS = ['big', 'major'];
var MINOR_UPDATE_SHORTHANDS = ['', 'minor'];
var PATCH_UPDATE_SHORTHANDS = ['bugfix', 'patch'];

var MAJOR_UPDATE = 'major';
var MINOR_UPDATE = 'minor';
var PATCH_UPDATE = 'patch';

var TopThat = {
    _packageData: undefined,
    _packageToUse: 'package.json',

    // Files we add a banner to; usually built/dist source JS.
    bannerFilesToUpdate: [],
    filesToUpdate: [],

    // Default upgradeType is "minor".
    upgradeType: MINOR_UPDATE,

    addBanner: function(fileString) {
        return template(BANNER, this.bannerData()) + fileString;
    },

    bannerData: function() {
        var data = this.getPackage();
        data.version = this.nextVersion();
        data.year = new Date().getFullYear();

        return data;
    },

    bumpVersion: function(fileString) {
        // Try to simply replace the JSON version attribute if the file is
        // valid JSON and has a "version" attribute.
        try {
            var json = JSON.parse(fileString);
            json.version = this.nextVersion();

            return JSON.stringify(json, null, 2) + '\n';
        } catch (err) {
            // Update any string matching the current version with the new
            // one. Obviously, this could be tweaked in the future.
            if (fileString.match(this.currentVersion)) {
                fileString.replace(this.currentVersion(), this.nextVersion());
            }

            return fileString;
        }
    },

    // Set the options for this topthat run.
    config: function(options) {
        if (options.upgradeType) {
            if (MAJOR_UPDATE_SHORTHANDS.indexOf(options.upgradeType)) {
                this.upgradeType = MAJOR_UPDATE;
            } else if (MINOR_UPDATE_SHORTHANDS.indexOf(options.upgradeType)) {
                this.upgradeType = MINOR_UPDATE;
            } else if (PATCH_UPDATE_SHORTHANDS.indexOf(options.upgradeType)) {
                this.upgradeType = PATCH_UPDATE;
            } else {
                return new Error('Unrecognized update type');
            }
        }

        if (options.banner) {
            this.bannerFilesToUpdate = options.banner;
        }

        if (options.files) {
            this.filesToUpdate = options.files;
        }

        return true;
    },

    // Return the current version of the package we're working on.
    currentVersion: function() {
        return this.getPackage().version;
    },

    getPackage: function() {
        // Return cached package data.
        if (this._packageData) {
            return this._packageData;
        }

        var pathToPackage = path.join(process.env.PWD, this._packageToUse);
        var fileString = fs.readFileSync(pathToPackage, 'utf8');

        try {
            this._packageData = JSON.parse(fileString);
            return this._packageData;
        } catch (err) {
            return false;
        }
    },

    nextVersion: function() {
        return semver.inc(this.currentVersion(), this.upgradeType);
    },

    replaceFiles: function() {
        var _this = this;
        var filesUpdated = 0;

        FILES_TO_ALWAYS_UPDATE.forEach(function(file) {
            if (_this.writeFile(file, 'bumpVersion')) {
                filesUpdated++;
            }
        });

        // If we failed to update bower.json AND package.json: we've failed.
        if (filesUpdated === 0) {
            return false;
        }

        // Other files we should replace the version number in.
        this.filesToUpdate.forEach(function(file) {
            _this.writeFile(file, 'bumpVersion');
        });

        // Files we should append a banner to.
        this.bannerFilesToUpdate.forEach(function(file) {
            _this.writeFile(file, 'addBanner');
        });

        return true;
    },

    writeFile: function(file, action) {
        var fileString;
        var pathToFile = path.join(process.env.PWD, file);

        try {
            fileString = fs.readFileSync(pathToFile, 'utf8');
        } catch (err) {
            return false;
        }

        var newFile = this[action](fileString);

        if (!newFile) {
            return false;
        }

        if (fs.writeFileSync(pathToFile, newFile) !== false) {
            return true;
        } else {
            return false;
        }
    }
};

module.exports = TopThat;
