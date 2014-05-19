'use strict';

var request = require('request');
var $ = require('cheerio');
var transmission = new (require('transmission'))();

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

    var best = $.load(body)( 'a[href^="magnet"]')[0];

    if (!best) {
      return callback(new Error('no matching torrent'));
    }

    callback(null, best.attribs.href);
  });
}

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

module.exports = {
  downloadBestTorrent: downloadBestTorrent,
  getBestTorrent: getBestTorrent,
};
