tbb-transmission
================

minimalist CLI that download the most seeded torrent on the piratebay for a given search

### Install

    npm install -g tbb-transmission

You need the [transmission client](http://www.transmissionbt.com/) installed and running on your machine.

For this to work, you need to enable remote access on transmission. See Preferences>Remote Control. Keep everything as default but please only allow access from localhost, just in case.

###usage:

####download the most seeded torrent:

    tbb-transmission the torrent name

####display the most seeded torrent name, in case you want to check before downloading:

    tbb-transmission the torrent name -s