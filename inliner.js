'use strict';

var inlineSource = require('inline-source').sync;
var minimatch = require("minimatch");

/*
 * Filter files to find HTML files.
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
    // var htmlFiles = Object.keys(files).filter(function(file) {
    //   // Make sure the filename ends in either htm or html
    // //   var checkIfInline = /[.](?:html?)$/.test(file);
    //   var checkIfInline = options.filter((o) => {return file.indexOf(o) > -1 && file.lastIndexOf(o) == file.length - o.length}).length > 0;
    //   console.log(checkIfInline, file)

    //   if (checkIfInline) {
    //     return file;
    //   }
    // });
    var htmlFiles = Object.keys(files).filter((file) => { return options.pattern.filter((pattern) => {
        return minimatch(file, pattern, { matchBase: true })
    }).length > 0});

    htmlFiles.map(function(path) {
    //console.log(path)
      files[path].contents = new Buffer(inlineSource(files[path].contents.toString(), options)), 'utf8';
    });
    done();
  };
};

module.exports = inline;
