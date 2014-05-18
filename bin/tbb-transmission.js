#!/usr/bin/env node

var downloadBest = require('../lib/index.js');

downloadBest(process.argv.splice(2).concat(''), function(err, torrentName) {
  if (err) {
    return console.log('Error:', err);
  }

  console.log('Downloading', torrentName);
});
