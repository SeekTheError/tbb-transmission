#!/usr/bin/env node
'use strict';
var argv = require('minimist')(process.argv.slice(2));
var lib = require('../lib/index.js');
var _ = require('lodash');

(function() {
  if (_.isEmpty(argv._)) {
    console.log('usage:\n  tbb-transmission [-s] the torrent name\n  -s:  only search for the torrent');
    return;
  }

  var query = argv._;

  if (!argv.s) {
    lib.downloadBestTorrent(query, function(err, torrent) {
      if (err) {
        console.log('Error:', err);
        return;
      }

      console.log('Downloading:', torrent.name, torrent.description);
    });

    return;
  }

  lib.getBestTorrent(query, function(err, torrent) {
    if (err) {
      console.log('Error:', err);
      return;
    }

    // as ugly as it gets
    var name = decodeURIComponent(torrent.magnet.split('&dn=')[1].split('&tr=')[0]);
    console.log('Best torrent Name:', name, torrent.description);
  });
})();
