'use strict';

var request = require('request');
var $ = require('cheerio');
var transmission = new (require('transmission'))();
var zlib = require('zlib');

var internals = {
  /**
   * Parse the torrent description from a Cherrio Node
   *
   * @private
   * @method getDescriptionFromNode
   * @param description {Object} Cheerio node object
   */
  getDescriptionFromNode: function(description) {
    var desc = null;

    if (description && description.children && description.children[0]) {
      desc = description.children[0].data ? description.children[0].data.toString() : null;
      desc = desc.split(',').splice(0, 2).toString();
    }

    return desc;
  }
};

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

  var res = request.get({
    url: url,
    headers: {
      'Accept-Encoding': 'gzip',
      'Accept-Language': 'en-US',
    }
  });

  var gunzip = zlib.createGunzip();
  res.pipe(gunzip);

  var buffer = [];

  gunzip.on('data', function(data) {
    buffer.push(data + '');
  });

  gunzip.on('end', function() {
    var body = buffer.toString('');
    var $loaded = $.load(body);
    var best = $loaded( 'a[href^="magnet"]')[0];

    if (!best) {
      return callback(new Error('no matching torrent'));
    }

    var description = $loaded('font.detDesc')[0];
    description = internals.getDescriptionFromNode(description);

    // @todo switch to a plain magnet + description
    callback(null, { magnet: best.attribs.href, description: description });
  });

  gunzip.on('error', function(err) {
    callback(err);
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
  getBestTorrent(torrentName, function(err, torrent) {
    transmission.addUrl(torrent.magnet, function(err, res) {
      if (err) {
        return callback(err);
      }

      callback(null, { name: res.name, description: torrent.description });
    });
  });
}

module.exports = {
  downloadBestTorrent: downloadBestTorrent,
  getBestTorrent: getBestTorrent,
};
