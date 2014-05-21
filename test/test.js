'use strict';

var lib = require('../lib');
var expect = require('chai').expect;

describe('lib test', function() {
  it('exposes two function', function() {
    expect(lib.getBestTorrent).to.be.a('Function');
    expect(lib.downloadBestTorrent).to.be.a('Function');
  });
});
