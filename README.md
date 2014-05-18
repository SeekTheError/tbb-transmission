tbb-transmission
================

minimalist CLI that download the most seeded torrent on the piratebay for a given search

### Install

    npm install -g tbb-transmission

You need the [transmission client](http://www.transmissionbt.com/) installed and running on your machine. You also need the transmission-remote command-line utility. I installed mine using brew on my mac but you should have it by default if you are running linux.

Last but not least, you have to enable the remote control on the client. See Preferences>Remote Control. Keep everything as default but please only allow access from localhost, just in case.

usage:

    tbb-transmission Archer
