# In the name of God

# Ajile Site Creator

## How to Start
This service uses node.js as server. If you don't have node.js installed, first
install node.js from [node's latest release](https://nodejs.org/download/release/latest/). Then,
- Add this service as a submodule to your's.
- copy all the content of the folder 'starter' to the root folder of your project.
-- Note that the folder named 'file' already exists and only the new files must be
   added. Be careful not to delete the existing files by replacing. Only merge folders.
- change these parameters as you wish:
-- in 'server.js', change the port from 8082 to 80 or whatever you like
-- in 'bower.json', change the name, version, homepage, authers and description
-- in 'package.json', change the fields named above plus url for repository and bugs
-- in 'requserHandlers.js', in the function 'login', change admin's password
-- in 'file/', change the favicon
-- in 'file/index.html', change the document title

## Customizing the DB

### Install MySQL
This service uses MySQL as db. So if you don't have MySQL installed on your system,
first you must install it. Usually apps like XAMPP are easy to use and provide
MySQL too. Download XAMPP from [Apache site](https://www.apachefriends.org/download.html.)

### Introduce DB to ServerSide Code
In the file '/starter/databaseHandler.js', in the function 'dbStart', after 'USE',
replace the db name 'test' by your db's name.


### Essential Tables
To have your site work, you must have exactly three tables in your db as follows:
