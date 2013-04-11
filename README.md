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
      "logs": {
        "Name": "/home/user/path/to/file.log"
      }
    }

The name is used for the button display in the browser.
