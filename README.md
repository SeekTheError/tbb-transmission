tbb-transmission
================

minimalist CLI that download the most seeded torrent on the piratebay for a given search

### Install

    npm install -g tbb-transmission

You need the [transmission client](http://www.transmissionbt.com/) installed and running on your machine. you also need the transmission-remote command-line utility, I installed mine using brew on my mac but you should have it by default if you are running linux.

You also need to enable the remote control in the client. see Preferences>Remote Control. Keep everything as default but please only allow access from localhost, just in case.

usage:

    tbb-transmission Archer
