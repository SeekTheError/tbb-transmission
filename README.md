tbb-transmission
================

*"Do you want to save time? Because that's how you save time."* 

tbb-transmission is a minimalist CLI that download the most seeded torrent on the piratebay for a given search.

### Install

    npm install -g tbb-transmission

You need the [transmission client](http://www.transmissionbt.com/) installed and running on your machine.

For this to work, you need to enable remote access on transmission. See Preferences>Remote Control. Keep everything as default but please only allow access from localhost, just in case.

###Usage:

####Show the most seeded torrent:

    tbb-transmission the torrent name

####Download the most seeded torrent:

    tbb-transmission the torrent name --download (or -d)

####Download a whole serie:

    tbb-transmission the torrent name --serie -d

if the -d is omitted, this will simply show the names of each matching torrents. It might be a very good idea, if you add the -d option, to limit in Transmission the number of parallel downloads. See Preferences>Transfer.

You can also specify a starting point. For more information, type:   

    tbb-transmission --usage

#### Configuration guideline

Every parameter can be configured directly, like the way you access transmission or even the site you use to find torrent(in case the pirate bay do not suits your needs):

    tbb-transmission --config

the configuration will be saved in you home directory under .tbb-transmission.json, and can be edit manually.


### Disclaimer

I do not encourage nor caution any kind of use you will have of this library. Please read the [MIT LICENSE](http://opensource.org/licenses/MIT) for more informations.

Pirating is bad, M'kay?
