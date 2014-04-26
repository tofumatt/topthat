var fs = require('fs');
var path = require('path');
var semver = require('semver');

var BANNER = '/*!\n' +
             '    {{name}} -- {{description}}\n' +
             '    Version {{version}}\n' +
             '    {{url}}\n' +
             '    (c) {{year}} {{author}}, {{license}}\n' +
             '*/\n';

var TopThat = {
    _filesToUpdate: ['bower.json', 'package.json'],

    _packageData: undefined,
    _packageToUse: 'package.json',

    // Default upgradeType is "minor".
    upgradeType: 'minor',

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

        this._filesToUpdate.forEach(function(file) {
            var pathToFile = path.join(process.env.PWD, file);
            try {
                var fileString = fs.readFileSync(pathToFile, 'utf8');
            } catch (err) {
                return;
            }

            // Try to simply replace the JSON version attribute if the file is
            // valid JSON and has a "version" attribute.
            try {
                var json = JSON.parse(fileString);
                json.version = _this.nextVersion();

                var newFile = JSON.stringify(json, null, 2) + '\n';

                if (fs.writeFileSync(pathToFile, newFile)) {
                    filesUpdated++;
                }
            } catch (err) {
                // TODO: Update non-JSON files?
                console.log(err);
            }
        });

        if (filesUpdated === this._filesToUpdate.length) {
            return true;
        } else {
            return false;
        }
    }
};

module.exports = TopThat;
