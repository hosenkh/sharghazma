# In the name of God

# Ajile Site Creator

## How to Start
This service uses node.js as server. If you don't have node.js installed, first
install node.js from [node's latest release](https://nodejs.org/download/release/latest/). Then,
- Add this service as a submodule to your's.
- copy all the content of the folder 'starter' to the root folder of your project.
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

### Essential Tables
To have your site work, you must have at least three tables in your db as follows:

#### users
The table at least has 3 fields:
- ID, not null, Primary key, auto-increment
- username
- password

There must be a user where `username` = 'admin' and another user where `username` = 'public'.
The passwords for these two doesn't matter.

#### user_permissions
The table has 3 fiels:
- ID, not null, Primary key, auto-increament
- UserId
- PermissionId

#### permissions
The table has 