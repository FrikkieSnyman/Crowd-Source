
# COS301_GroupProject

Sample project can be found at
http://188.166.89.244

[![Build Status](https://travis-ci.org/FrikkieSnyman/COS301_GroupProject.svg?branch=master)](https://travis-ci.org/FrikkieSnyman/COS301_GroupProject)
[![Dependency Status](https://gemnasium.com/FrikkieSnyman/COS301_GroupProject.svg)](https://gemnasium.com/FrikkieSnyman/COS301_GroupProject)
[![Stories in Ready](https://badge.waffle.io/FrikkieSnyman/COS301_GroupProject.png?label=ready&title=Ready)](https://waffle.io/FrikkieSnyman/COS301_GroupProject)
[![Stories in Progress](https://badge.waffle.io/FrikkieSnyman/COS301_GroupProject.png?label=In%20Progress&title=In%20Progress)](https://waffle.io/FrikkieSnyman/COS301_GroupProject)


This is the repo for the COS301 Main Project, for team "The fellowship of the CIN".
##Installation insturctions.
First clone the repo.
```
git clone https://github.com/FrikkieSnyman/COS301_GroupProject.git
```
Now change to the directory and run the install. This will use npm install to install the backend dependencies and it will also run bower install to install frontend dependencies.
```
npm install
```
Ensure that an instance of monogDB is running, then to run the server use
```
grunt
```
Once you have done this you can navigate to http://localhost:3000/ to view the page and start interacting with it.

##How to setup the database
You need to have mongodb installed on your pc.
Please follow the link for futher instructions.
http://docs.mongodb.org/manual/installation/
After you have installed mongdb you can start it in the terminal with.
```
mongod 
```
On some systems the sudo command might be required. Now we will want to create a database. In order to do this we simply logon to mongo.
```
mongo
```
Then we create the database we want to use with the 'use' command.
```
use myDB
```
Congratualtions you have created your database. The only thing left now is to add your database credentails to the config.js file.

##Unit tests
NOTE: The unit tests can only be run on a Unix based system (ie, OSX/Linux), seeing as some environment variables are set in the npm scripts.

First, ensure you have phantomjs installed globally
To install phantomjs globally (might require superuser rights)
```
npm install phantomjs -g
```
Now navigate to the root of the project, and run
```
grunt test
```
to run the unit tests. This will run the backend tests as well as the frontend tests
##JSCS
JSCS is used to validate code style, this allows all of the code to have a similar style thus making it easier to understand.

To use JSCS first install the jscs npm package with the command
```
npm install -g jscs
```
Once this is done a file can be checked in the terminal using the command
```
cat example.js | jscs
```

The following two sublime text packages can also be used to assist with the checking process:
* SublimeLinter-jscs
* JSCS-Formatter

##Mobile Application

The mobile app will be built at a later stage.

