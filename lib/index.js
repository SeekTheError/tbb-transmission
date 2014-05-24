'use strict';

var _ = require('lodash');
var zlib = require('zlib');
var $ = require('cheerio');
var request = require('request');
var transmission = new (require('transmission'))();
var EpisodeIdIterator = require('./episodeIdIterator.js');

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
 * Return a torrent plain object  using tpb
 *
 * @method findBestTorrent
 * @param torrentName {Array of String|String} the seach terms
 * @param callback
 *   @param callback.err {Error}
 *   @param callback.res {Object}
 *     @param callback.res.magnet {String} the torrent magnet link
 *     @param callback.res.description {Object} the torrent description
 */
function findBestTorrent(torrentName, callback) {
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
    callback(new Error('Failed to retrieve informations from the piratebay', err));
  });
}

/**
 * Download the best torrent from tpb
 *
 * @method downloadTorrent
 * @param torrentName {Array of String|String} the seach terms
 * @param callback
 *   @param callback.err {Error}
 *   @param callback.res {Object}
 *     @param callback.res.name {String} the torrent name
 *     @param callback.res.description {Object} the torrent description
 */
function downloadTorrent(torrent, callback) {
  if (!_.isString(torrent.magnet)) {
    callback(new Error('torrent.magnet must be a String'));
    return;
  }

  transmission.addUrl(torrent.magnet, function(err, res) {
    if (err) {
      return callback(new Error('Could not reach the transmission client', err));
    }

    callback(null, { name: res.name, description: torrent.description });
  });
}

function downloadSeason(torrentName, fromSeason, fromEpisode, download, callback) {
  var episodeId = new EpisodeIdIterator(torrentName, fromSeason, fromEpisode, download, callback);

  internals.$downloadSeason(episodeId);
}

internals.$downloadSeason = function(episodeId) {
  findBestTorrent(episodeId.toString(), function(err, torrent) {
    if (err && episodeId.newSeason) {
      episodeId.finalize();
      return;
    }

    if (err) {
      episodeId.nextSeason();
      internals.$downloadSeason(episodeId);
      return;
    }

    if (!episodeId.download) {
      console.log(episodeId.toString(), torrent.description);
      episodeId.registerSuccess(torrent);
      episodeId.nextEpisode();
      internals.$downloadSeason(episodeId);
      return;
    }

    downloadTorrent(torrent, function(err, torrent) {
      if (err) {
        console.error(err);
      }
      console.log('Downloading:', episodeId.toString(), torrent.description);
      episodeId.registerSuccess(torrent);
      episodeId.nextEpisode();
      internals.$downloadSeason(episodeId);
    });
  });
};

var exports = {
  downloadTorrent: downloadTorrent,
  findBestTorrent: findBestTorrent,
  downloadSeason: downloadSeason,
  EpisodeIdIterator: EpisodeIdIterator,
};

// exports internals for test purpose
if (process.env.NODE_ENV === 'test') {
  exports.internals = internals;
}

module.exports = exports;
