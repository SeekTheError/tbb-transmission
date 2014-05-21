'use strict';

var internals = {
  prefix: function(n) {
    if ((n + '').length === 1) {
      return  '0' + n;
    }
    return n + '';
  }
};

var EpisodeIdIterator = function EpisodeIdIterator(torrentName, fromSeason, fromEpisode) {

  if (!torrentName) {
    throw new Error('missing parameter for new EpisodeIdIterator: torrentName');
  }

  this.previousFail = false;
  this.torrentName = torrentName;
  this.season = fromSeason || 1;
  this.episode = fromEpisode || 1;
};

EpisodeIdIterator.prototype.nextEpisode = function() {
  this.episode++;
  return this;
};

EpisodeIdIterator.prototype.nextSeason = function() {
  this.season++;
  this.episode = 1;
  return this;
};

EpisodeIdIterator.prototype.toString = function() {
  return this.torrentName + ' s' + internals.prefix(this.season) + 'e' + internals.prefix(this.episode);
};

module.exports = EpisodeIdIterator;
