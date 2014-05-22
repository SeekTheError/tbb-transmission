'use strict';

var _ = require('lodash');

var internals = {
  prefix: function(n) {
    if ((n + '').length === 1) {
      return  '0' + n;
    }
    return n + '';
  }
};

var EpisodeIdIterator = function EpisodeIdIterator(torrentName, fromSeason, fromEpisode, download, finalize) {
  if (!torrentName) {
    throw new Error('missing parameter for new EpisodeIdIterator: torrentName');
  }

  if (!_.isFunction(finalize)) {
    throw new Error('EpisodeIteratorId: finalize must be a function');
  }

  this.listSuccess = [];
  this.download = download || false;
  this.previousFail = false;
  this.torrentName = torrentName;
  this.season = fromSeason || 1;
  this.episode = fromEpisode || 1;
  this.newSeason = false;
  this.$finalize = finalize;
};

EpisodeIdIterator.prototype.nextEpisode = function() {
  this.episode++;
  this.newSeason = false;
  return this;
};

EpisodeIdIterator.prototype.nextSeason = function() {
  this.season++;
  this.episode = 1;
  this.newSeason = true;
  return this;
};

EpisodeIdIterator.prototype.toString = function() {
  return this.torrentName + ' s' + internals.prefix(this.season) + 'e' + internals.prefix(this.episode);
};

EpisodeIdIterator.prototype.registerSuccess = function(torrent) {
  this.listSuccess.push( { name: this.toString(), torrent: torrent });
};

EpisodeIdIterator.prototype.finalize = function() {
  this.$finalize(this);
};

module.exports = EpisodeIdIterator;
