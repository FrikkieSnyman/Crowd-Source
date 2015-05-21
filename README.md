# COS301_GroupProject
This is the repo for the COS301 Main Project, for team "The fellowship of the CIN".
##Installation insturctions.
First clone the repo.
```
git clone https://github.com/FrikkieSnyman/COS301_GroupProject.git
```
Now run the install.
```
npm install
```
To run the server use.
```
npm start
```
##How to setup the database.
Firsly you need to have mongodb installed on your pc.
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
##Requirements.
###Functional.
###Non functional.
