var request = require('request');
var $ = require('jquery');
var jsdom = require('jsdom-little');
var exec = require('child_process').exec;

function downloadBest(torrentName, callback) {
  // tbb most seeded url
  var url = 'http://thepiratebay.se/search/' + encodeURIComponent(torrentName) + '/0/7/0'

  request.get({ url: url }, function(err, res, body) {
    if(err) {
      return callback(err);
    }

    jsdom.env(body,function(err, window) {
      var best = $(window)( "a[href^='magnet']" )[0];
      if (!best) {
        return callback(new Error("no matching torrent"))
      }

      var command =   'transmission-remote 127.0.0.1:9091 -a ' + best.href;
        exec(command, function(err, stdout, stderr) {
          if (err) {
            return callback(err);
          }
          var filename = best.href.split('&dn')[1].split('&tr')[0]
          callback(null, filename);
        });
    });
  });
}

// cli utility
if (require.main.filename === __filename) {
  downloadBest(process.argv.splice(2).concat(''), function(err, torrentName) {
    if (err) {
      return console.log('ERROR', err);
    }
    console.log('downloading', torrentName);
  });
}

module.exports = downloadBest;
