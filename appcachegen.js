#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var dir = require('node-dir');
var ignore = require('ignore');

var ignoreFiles = ['.appcacheignore'];

var argv = require('yargs')
  .usage('Usage: appcachegen [directory] [options]')
  .alias('o', 'output')
  .describe('o', 'Write to file')
  .alias('i', 'ignore')
  .describe('i', 'Ignore file')
  .alias('r', 'rules')
  .describe('r', 'Extra rules file')
  .help('help').alias('help', 'h')
  .argv;

module.exports = function(root, opts) {

  root = path.normalize(root);
  var ig = ignore();
  var write = console.log;

  if (opts.ignoreFile) {
    ignoreFiles.unshift(opts.ignoreFile);
  }
  ig.addIgnoreFile(ignore.select(ignoreFiles));

  if (opts.outFile) {
    ig.addPattern(opts.outFile);
    var stream = fs.createWriteStream(opts.outFile, 'utf8');
    write = function(str) { stream.write(str + '\n'); };
  }

  write('CACHE MANIFEST');
  write('# ' + new Date());
  write('');

  dir.files(root, function(err, files) {
    if (err) throw err;

    ig.filter(files).map(function(file) {
      // Address files from root as subpages will often
      // reference the manifest
      file = '/' + path.relative(root, file);

      write(file);
      // If we have a file with /index.html, save an entry for / as well
      if (/\/index.html$/.test(file)) {
        write(file.replace(/index.html$/, ''));
      }
    });

    write('');

    var networkWritten = false;
    if (opts.rulesFile) {
      var tmp = fs.readFileSync(opts.rulesFile, 'utf8');
      write(tmp);
      networkWritten = /NETWORK:/.test(tmp);
    }

    // Give a sensible default for network, but only if
    // user didnt provide one
    if (!networkWritten) {
      write('NETWORK:');
      write('*');
    }
  });
};

if (require.main === module) {
  module.exports(argv._[0] || '.', {
    ignoreFile: argv.i,
    outFile: argv.o,
    rulesFile: argv.r
  });
}
