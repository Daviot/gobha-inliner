'use strict';

var inlineSource = require('inline-source').sync;
var minimatch = require("minimatch");

/*
 * Filter files to find files, that match the minimatch array filter.
 * Iterate through each file name and grab
 * the contents of each file and replace
 * with an inlined version.
 */

var inline = function(options) {
    console.log(options)
    var patternDefault = ["*.html"];
	if (options.pattern == null) {
        options.pattern = patternDefault;
    }
    if(typeof options.pattern == 'String') {
        options.pattern = [options.pattern];
    }
  return function(files, metalsmith, done) {
    var htmlFiles = Object.keys(files).filter((file) => { return options.pattern.filter((pattern) => {
        return minimatch(file, pattern, { matchBase: true })
    }).length > 0});

    htmlFiles.map(function(path) {
      files[path].contents = new Buffer(inlineSource(files[path].contents.toString(), options)), 'utf8';
    });
    done();
  };
};

module.exports = inline;
