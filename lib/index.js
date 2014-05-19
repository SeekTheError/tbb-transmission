'use strict';

var request = require('request');
var $ = require('jquery');
var jsdom = require('jsdom-little');
var transmission = new (require('transmission'))();

function downloadBest(torrentName, callback) {
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

      var command =   'transmission-remote 127.0.0.1:9091 -a ' + best.href;
      transmission.addUrl(best.href, function(err, arg) {
        if (err) {
          return callback(err);
        }
        
        callback(null, arg.name);
      });
    });
  });
}

module.exports = downloadBest;
