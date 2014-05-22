#!/usr/bin/env node
'use strict';
var argv = require('minimist')(process.argv.slice(2));
var lib = require('../lib/index.js');
var _ = require('lodash');

(function() {
  if (_.isEmpty(argv._) || argv.usage) {
    var pkg = require('../package.json');
    var usage = '' +
      'tbb-transmission, version:' + pkg.version + '\n\n' +
      'USAGE:  tbb-transmission [--season|--download or -d] the torrent name\n\n' +
      'DEFAULT: only display the torrent name\n\n' +
      '--download or -d: send the torrent for Transmission to download\n' +
      '--season: show all the episode available in a serie, can be combined with the --download option\n' +
      '  -s: the season number to start with\n' +
      '  -e: the download number to start with\n' +
      '--usage: show this help section\n';

    console.log(usage);
    return;
  }

  var query = argv._;
  var download = argv.d || argv.download;

  if (argv.season) {
    var sNumber = argv.s ? parseInt(argv.s) : 1;
    var eNumber = argv.e ? parseInt(argv.e) : 1;
    lib.downloadSeason(query, sNumber, eNumber, download, function(/*episodeId*/) {
      console.log('Done');
    });

    return;
  }

  if (download) {
    lib.findBestTorrent(query, function(err, torrent) {
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

  lib.findBestTorrent(query, function(err, torrent) {
    if (err) {
      console.log('Error:', err);
      return;
    }

    // as ugly as it gets
    var name = decodeURIComponent(torrent.magnet.split('&dn=')[1].split('&tr=')[0]);
    console.log('Best torrent Name:', name, torrent.description);
  });
})();
