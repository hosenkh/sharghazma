crypto = require('./encripter');
fileLoader = require('./fileLoader');
querystring = require('querystring');
databaseHandler = require('./databaseHandler');

addressPurifier = function (address) {
  address = address.toString();
  var
  pathnameArray = address.toString().split('/').shift().shift();
  var purePath = '';
  for (var i in pathnameArray) {
    purePath += '/'+pathnameArray[i];
  }
  return purePath;
};

queryParser = function (query) {
  var
  splittedQuery = query.split('&'),
  parsedQuery = {};
  for (var i in splittedQuery) {
    var command = splittedQuery[i].split('=');
    parsedQuery[command[0]] = command[1];
  }
  return parsedQuery;
};

userDecryptor = function (cookies) {
  var user;
  if (cookies.user) {
    return (user);
  } else {
    return 'public';
  }
};

main = function (response, address, cookies) {
  var tempPath = address;
  if (tempPath === '/') {
    tempPath += 'index.html';
  }
  fileLoader.load(response, tempPath, cookies);
};

db = function (response, address, queryOptions, method, cookies) {
  username = userDecryptor(cookies);
  queryObj = querystring.parse(queryOptions);
  if (method == 'get') {
    
  }
  if (method == 'post') {
    
  }
  databaseHandler.dbRequest(username, ...);
};

restricted = function (response, address, queryOptions, method, cookies) {

};

save = function (response, address, queryOptions, method, cookies) {
  if (method == 'post') {
    console.log(queryOptions);
  }
};

login = function (response, address, queryOptions, method, cookies) {
  var
  users = [
    {username: 'ali', password: '1234'},
    {username: 'hosein', password: '2345'}
  ],
  query = queryParser(queryOptions),
  found = false;
  console.log(userDecryptor(cookies));
  if (method == 'post' && address == '/login') {
    for (var i in users) {
      if (users[i].username == query.username) {
        if (users[i].password == query.password) {
          response.writeHead(200, {
            'set-cookie': 'user='+crypto.encrypt(query.username)+';httpOnly=true;expires='+new Date(new Date().getTime()+15000).toUTCString()
          });
          response.write('login successful');
          response.end();
        } else {
          response.writeHead(200, {
            'set-cookie': 'user='+crypto.encrypt('public')+';httpOnly=true'
          });
          response.write('password incorrect');
          response.end();
        }
        found = true;
      }
    }
    if (!found) {
        response.write('no such user');
        response.end();
    }
  }
};

logout = function (response, address, queryOptions, method, cookies) {
  response.writeHead(200, {
    'set-cookie': 'user='+crypto.encrypt('public')+';httpOnly=true'
  });
  response.write('logout successful');
  response.end();
};

exports['main'] = main;
exports['db'] = db;
exports['restricted'] = restricted;
exports['save'] = save;
exports['login'] = login;
exports['logout'] = logout;