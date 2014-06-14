#!/usr/bin/env node
'use strict';
var argv = require('minimist')(process.argv.slice(2));
var lib = require('../lib/index.js');
var _ = require('lodash');
var fs = require('fs');
var prompt;

var configPath =  process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
configPath = require('path').join(configPath,  '.tbb-transmission.json') + '';

function getAndWriteConfig() {
  var configParams  = {
    properties: {
      host: {
        description: 'the host of the transmission client',
        default: 'localhost',
      },
      port: {
        description: 'the port of the transmission client',
        default: '9091',
      },
      username: {
        description: 'username for transmission',
        default: '',
      },

      password: {
        description: 'password for transmission',
        default: '',
      },
      rpcUrl: {
        description: 'url for transmission rpc method call',
        default: '/transmission/rpc',
        pattern: /^\//,
      },
      torrentSearchUrl: {
        description: 'follow the default pattern, and make sure its ordered by seeds',
          default: 'http://thepiratebay.se/search/--search--/0/7/0',
          pattern: /^(http:\/\/.*--search--.*)/,
      },
    },
  };

  prompt.get(configParams, function(err, config) {
    if (err) {
      console.log(err);
      return;
    }

    var jsonConfig = JSON.stringify(config, null, 2);
    fs.writeFileSync(configPath, jsonConfig, { flag: 'w' });
    console.log('SUCCES, configuration saved in: ' + configPath);
  });
}

(function() {

  if (argv.config) {
    prompt = require('prompt');
    prompt.color = true;
    prompt.message = '>';
    prompt.start();

    getAndWriteConfig();

    return;
  }

  if (_.isEmpty(argv._) || argv.usage) {
    var pkg = require('../package.json');
    var usage = '' +
      'tbb-transmission, version:' + pkg.version + '\n\n' +
      'USAGE:  tbb-transmission [--serie|--download or -d] the torrent name\n\n' +
      'DEFAULT: only display the torrent name\n\n' +
      '--download or -d: send the torrent for Transmission to download\n' +
      '--serie: show all the episode available in a serie, can be combined with the --download option\n' +
      '  -s: the serie number to start with\n' +
      '  -e: the episode number to start with\n' +
      '--config: allow overide of the transmission parameters, and torrent search url' +
      '--usage: show this help section\n';

    console.log(usage);
    return;
  }

  var config = fs.existsSync(configPath) ? require(configPath) : null;

  if (config) {
    lib.setConfig(config);
  }

  var query = argv._;
  var download = argv.d || argv.download;

  if (argv.serie) {
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

        if (torrent.description) {
          console.log('Downloading:', torrent.name, torrent.description);
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

    if (torrent.description) {
      console.log('Best torrent Name:', name, torrent.description);
      return;
    }
    console.log('Best torrent Name:', name);
  });
})();
