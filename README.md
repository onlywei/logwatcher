LogWatcher
==========

This is a simple web application I have written to watch log files from a browser. The primary motivation for its creation is for me to learn how to use WebSockets in NodeJS while creating something useful for myself. It uses WebSockets [ws by einaros](http://einaros.github.com/ws).

Installation
============

    npm install -g logwatcher

Usage
=====

Create a .logwatchrc file in your home directory. Then just run:

    logwatch

Sample .logwatchrc file:

    {
      "port": 4000,
      "logs": {
        "Name": "/home/user/path/to/file.log"
      }
    }

Port of 4000 is default.
The name is used for the button display in the browser.
