router = function () {
  var
  head = {"content-type": "text/html"},

  init = function (handle, pathname, response, URL, method, cookies) {
    pathnameArray = pathname.split('/').shift();
    pathnameArray[0] = '/'+pathnameArray[0];
    if (typeof handle[pathnameArray[0]] === 'function') {
      handle[pathnameArray[0]](response, pathname, URL, method, cookies);
    } else {
      handle['/'](response, pathname, cookies);
    }
  };
  return {init: init};
};
exports.init = router().init;