
# COS301_GroupProject

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
Now change to the directory and run the install.
```
npm install
```
Now change to the www directory and run npm install there too. This is done to keep the client side and server side completely seperate. This should be replaced by a grunt script in the future.
```
cd ./www
npm install
```
Change back to the root directory. Ensure that an instance of monogDB is running, then to run the server use
```
npm start
```

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

##NodeUnit
To install nodeunit globally
```
npm install nodeunit -g
```
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
###Android
The android application can be downloaded from the following link.

https://build.phonegap.com/apps/1466735/download/android
##Requirements
###Functional
####Login System
This system will connect to an already existing user database as provided by the client. This will then be integrated so that the app knows who did what.
####Project System
This system will be used to create projects. It will be built in such a way to allow for a project tree to be built. This system will be integrated to allow users to make estimations on the project.
####Estimation System
This is the system that will be used to provide estimations. From this system, statistical analysis can be made on past estimations.
###Non-functional
