'use strict';

var inlineSource = require('inline-source').inlineSource;
var minimatch = require('minimatch');

/*
 * Filter files to find files, that match the minimatch array filter.
 * Iterate through each file name and grab
 * the contents of each file and replace
 * with an inlined version.
 */

var inline = function(options) {
    // console.log(options);
    var patternDefault = ['*.html'];
    if (options.pattern == null) {
        options.pattern = patternDefault;
    }
    if (typeof options.pattern == 'String') {
        options.pattern = [options.pattern];
    }
    return function(files, metalsmith, done) {
        var htmlFiles = Object.keys(files).filter(file => {
            return (
                options.pattern.filter(pattern => {
                    return minimatch(file, pattern, { matchBase: true });
                }).length > 0
            );
        });

        htmlFiles.map(async function(path) {
            try {
                var content = files[path].contents.toString();
                var inlined = await inlineSource(content, {
                  compress: true
                });
                files[path].contents = Buffer.from(inlined, 'utf8');
            } catch (e) {
                console.error('[ERROR] inliner error in', path);
                console.error(e);
            }
        });

        done();
    };
};

module.exports = inline;
