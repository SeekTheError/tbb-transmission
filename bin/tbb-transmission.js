#!/usr/bin/env node
'use strict';
var argv = require('minimist')(process.argv.slice(2));
var lib = require('../lib/index.js');
var _ = require('lodash');

(function() {
  if (_.isEmpty(argv._) || argv.usage) {
    console.log('usage:\ntbb-transmission [--season|--download or -d] the torrent name\n');
    console.log('DEFAULT: only display the torrent name\n');
    console.log('--download or -d: send the torrent for Transmission to download');
    console.log('--season: show all the episode available in a serie, can be combined with the --download option');
    console.log('--usage: show this help section');
    return;
  }

  var query = argv._;
  var download = argv.d || argv.download;

  if (argv.season) {
    lib.downloadSeason(query, 1, 1, download, function(episodeId) {
      console.log(episodeId);
      return;
    });

    return;
  }

  if (download) {
    lib.getBestTorrent(query, function(err, torrent) {
      if (err) {
        console.log('Error:', err);
        return;
      }

      lib.downloadTorrent(torrent, function(err, torrent) {
        if (err) {
          console.log(err);
          return;
        }

        console.log('Downloading:', torrent.name, torrent.description);
      });
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
