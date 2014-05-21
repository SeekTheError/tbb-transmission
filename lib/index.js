'use strict';

var request = require('request');
var $ = require('cheerio');
var transmission = new (require('transmission'))();
var zlib = require('zlib');

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

  var res = request.get({ url: url, headers: { 'Accept-Encoding': 'gzip' } });

  var gunzip = zlib.createGunzip();
  res.pipe(gunzip);

  var buffer = [];

  gunzip.on('data', function(data) {
    buffer.push(data + '');
  });

  gunzip.on('end', function() {
    var body = buffer.toString('');
    var best = $.load(body)( 'a[href^="magnet"]')[0];

    if (!best) {
      return callback(new Error('no matching torrent'));
    }

    callback(null, best.attribs.href);
  })

  gunzip.on('error', function(err) {
    callback(err);
  })
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
