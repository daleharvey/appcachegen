#!/usr/bin/env node

'use strict';

var dir = require('node-dir');
var fs = require("fs");
var ignore = require('ignore')();

var argv = require('yargs')
  .usage('Usage: $0 directory')
  .alias('o', 'output')
  .describe('o', 'Write to file')
  .argv;

var write = console.log;
var root = argv._[0] || '.';

if (argv.i) {
  ignore.addPattern(argv.i);
  var tmp = fs.readFileSync(argv.i, 'utf8');
  ignore.addPattern(tmp.split('\n'));
}

if (argv.o) {
  ignore.addPattern(argv.o);
  var stream = fs.createWriteStream(argv.o, 'utf8');
  write = function(str) { stream.write(str + '\n'); };
}

write('CACHE MANIFEST');
write('# ' + new Date());
write('');

dir.files(root, function(err, files) {
  if (err) throw err;
  ignore.filter(files).map(function(file) {
    write(file);
  });
});
