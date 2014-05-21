'use strict';

var _ = require('lodash');
var lib = require('../lib');
var expect = require('chai').expect;

describe('lib test', function() {
  it('exposes the functions', function() {
    expect(_.size(lib)).to.equal(3);
    expect(lib.getBestTorrent).to.be.a('Function');
    expect(lib.downloadBestTorrent).to.be.a('Function');
    expect(lib.EpisodeIdIterator).to.be.a('Function');
  });

  describe('EpisodeIdIterator', function() {
    var EpisodeIdIterator = lib.EpisodeIdIterator;

    it('is a function', function() {
      expect(EpisodeIdIterator).to.be.a('Function');
    });

    it('throw an error if instanciated without a name', function() {
      var fn = function() {
        new EpisodeIdIterator();
      };
      expect(fn).to.throw();
    });

    it('initialize correctly with only a torrent name', function() {
      var ei = new EpisodeIdIterator('Archer');

      expect(ei.toString()).to.equal('Archer s01e01');
    });

    it('initialize correctly with a season number', function() {
      var ei = new EpisodeIdIterator('Archer', 4);

      expect(ei.toString()).to.equal('Archer s04e01');
    });

    it('initialize correctly with an episode number', function() {
      var ei = new EpisodeIdIterator('Archer', null, 10);

      expect(ei.toString()).to.equal('Archer s01e10');
    });

    it('pass to the next episode and return this', function() {
      var ei = new EpisodeIdIterator('Archer', 3, 7);
      var res = ei.nextEpisode();

      expect(res).to.equal(ei);
      expect(res.toString()).to.equal('Archer s03e08');
    });

    it('pass to the next season and return this', function() {
      var ei = new EpisodeIdIterator('Archer', 1, 10);
      var res = ei.nextSeason();

      expect(res).to.equal(ei);
      expect(res.toString()).to.equal('Archer s02e01');
    });
  });
});
