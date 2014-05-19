#!/usr/bin/env node
'use strict';

var lib = require('../lib/index.js');
var query = process.argv.splice(2);

if (query.length === 0) {
  console.log('usage:\n  tbb-transmission [-s] the torrent name\n  -s:  only search for the torrent');
  return;
}

if (query.indexOf('-s') === -1) {
  lib.downloadBestTorrent(query, function(err, torrentName) {
    if (err) {
      return console.log('Error:', err);
    }

    console.log('Downloading', torrentName);
  });

  return;
}

// remove the -s parameter
query.splice(query.indexOf('-s'),1);

lib.getBestTorrent(query, function(err, magnet) {
  if (err) {
    return console.log('Error:', err);
  }

  // as ugly as it gets
  var name = decodeURIComponent(magnet.split('&dn=')[1].split('&tr=')[0]);
  console.log('Best torrent Name:', name);
});
