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
  splittedQuery = [],
  parsedQuery = {};
  if (query) {
    splittedQuery = query.split('&');
    parsedQuery = {};
    for (var i in splittedQuery) {
      var command = splittedQuery[i].split('=');
      parsedQuery[command[0]] = command[1];
    }
  }
  return parsedQuery;
};

userDecryptor = function (cookies) {
  var user;
  if (cookies.user) {
    return (crypto.decrypt(cookies.user));
  } else {
    return 'public';
  }
};

main = function (response, address, cookies) {
  var tempPath = address;
  if (tempPath === '/') {
    tempPath += 'index.html';
  }
  fileLoader.load(response, '',tempPath, cookies);
};

db = function (response, address, queryOptions, method, cookies, postData) {
  username = userDecryptor(cookies);
  queryObj = querystring.parse(queryOptions);
  if (method == 'get') {
    databaseHandler.showLink(username, queryObj.menu, function(results) {
      response.write(results);
      response.end();
    });
  }
  if (method == 'post') {
    databaseHandler.dbRequest(username, queryObj.selectionArray, queryObj.command, queryObj.data, function(results) {
      response.write(results);
      response.end();
    });
  }
};

restricted = function (response, address, queryOptions, method, cookies, postData) {
  username = userDecryptor(cookies);
  queryObj = querystring.parse(queryOptions);
  databaseHandler.dbCheckPermission(username, 'download', address, function (permission) {
    if (permission) {
      fileLoader.load(response, '', address, cookies);
    } else {
      if (username == 'public') {
        fileLoader.load(response, 'page='+address,'/restricted/login.html', cookies);
      } else {
        fileLoader.load(response, '','/restricted/accessDenied.html', cookies);
      }
    }
  });
};

save = function (response, address, queryOptions, method, cookies, postData) {
  if (method == 'post') {
    console.log(queryOptions);
  }
};

login = function (response, address, queryOptions, method, cookies, postData) {
  postObject = JSON.parse(postData);
  if (cookies.page) {
    lastPage = '/#/'+ addressPurifier(cookies.page);
  } else {
    lastPage = '/';
  }
  if (method == 'post' && address == '/login') {
    if (postObject.username == 'admin') {
      if (postObject.password == 'JPDrom27-') {
        response.writeHead(200, {
          'set-cookie': 'user='+crypto.encrypt(postObject.username)+';httpOnly=true;expires='+new Date(new Date().getTime()+15000).toUTCString()
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
    } else {
      var
      usernameSelectionArray = [
        {
          table: "users",
          conditions: {
            username: [postObject.username]
          },
          exportFields: ["ID"]
        }
      ],
      passwordSelectionArray = [
        {
          table: 'users',
          conditions: {
            username: [postObject.username],
            password: [postObject.password]
          },
          exportFields: ['ID']
        }
      ];
      console.log(usernameSelectionArray[0].conditions, passwordSelectionArray[0].conditions);
      databaseHandler.dbRequest('public', usernameSelectionArray, 'select', '', function(results){
        console.log('dbRequest');
        if (results.length == 1) {
          databaseHandler.dbRequest('public', passwordSelectionArray, 'select', '', function(results){
            if (results.length == 1) {
              console.log(postObject);
              response.writeHead(200, {
                'set-cookie': 'user='+crypto.encrypt(postObject.username)+';httpOnly=true;expires='+new Date(new Date().getTime()+15000).toUTCString()
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
          });
        } else {
          response.write('no such user');
          response.end();
        }
      });
    }
  }
};

logout = function (response, address, queryOptions, method, cookies, postData) {
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