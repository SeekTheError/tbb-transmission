tbb-transmission
================

*"Do you want to save time? Because that's how you save time."* 

tbb-transmission is a minimalist CLI that download the most seeded torrent on the piratebay for a given search.

### Install

    npm install -g tbb-transmission

You need the [transmission client](http://www.transmissionbt.com/) installed and running on your machine.

For this to work, you need to enable remote access on transmission. See Preferences>Remote Control. Keep everything as default but please only allow access from localhost, just in case.

###usage:

####download the most seeded torrent:

    tbb-transmission the torrent name

####display the most seeded torrent name, in case you want to check before downloading:

    tbb-transmission the torrent name -s

### Disclaimer

I do not encourage nor caution any kind of use you will have of this library. Please read the [MIT LICENSE](http://opensource.org/licenses/MIT) for more information.

Pirating is bad, M'kay?
