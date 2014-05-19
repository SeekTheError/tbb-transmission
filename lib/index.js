'use strict';

var request = require('request');
var $ = require('jquery');
var jsdom = require('jsdom-little');
var transmission = new (require('transmission'))();

/**
 * Download the best torrent from tbb
 *
 * @method getBestTorrent
 * @param torrentName {Array of String|String} the seach terms
 * @param callback
 *   @param callback.err {Error}
 *   @param callback.res {String} the torrent name
 */
function downloadBestTorrent(torrentName, callback) {
  getBestTorrent(torrentName, function(err, magnet) {
    transmission.addUrl(magnet, function(err, res) {
      if (err) {
        return callback(err);
      }

      callback(null, res.name);
    });
  });
}

/**
 * Return the magnet link of the best torrent from tbb
 *
 * @method getBestTorrent
 * @param torrentName {Array of String|String} the seach terms
 * @param callback
 *   @param callback.err {Error}
 *   @param callback.res {String} the magnet url
 */
function getBestTorrent(torrentName, callback) {
  // tbb most seeded url
  var url = 'http://thepiratebay.se/search/' + encodeURIComponent(torrentName) + '/0/7/0';

  request.get({ url: url }, function(err, res, body) {
    if(err) {
      return callback(err);
    }

    jsdom.env(body,function(err, window) {
      if(err) {
        return callback(err);
      }

      var best = $(window)( 'a[href^="magnet"]:first')[0];

      if (!best) {
        return callback(new Error('no matching torrent'));
      }
      callback(null, best.href);
    });
  });
}

module.exports = {
  downloadBestTorrent: downloadBestTorrent,
  getBestTorrent: getBestTorrent,
};
