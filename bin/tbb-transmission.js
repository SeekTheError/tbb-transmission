#!/usr/bin/env node
'use strict';
var argv = require('optimist').argv;
var lib = require('../lib/index.js');

(function() {
  if (!argv._) {
    console.log('usage:\n  tbb-transmission [-s] the torrent name\n  -s:  only search for the torrent');
    return;
  }

  var query = argv._;

  if (!argv.s) {
    lib.downloadBestTorrent(query, function(err, torrentName) {
      if (err) {
        console.log('Error:', err);
        return;
      }

      console.log('Downloading', torrentName);
    });

    return;
  }

  lib.getBestTorrent(query, function(err, magnet) {
    if (err) {
      console.log('Error:', err);
      return;
    }

    // as ugly as it gets
    var name = decodeURIComponent(magnet.split('&dn=')[1].split('&tr=')[0]);
    console.log('Best torrent Name:', name);
  });
})();
