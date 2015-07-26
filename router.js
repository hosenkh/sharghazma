router = function () {
  var
  head = {"content-type": "text/html"},

  init = function (handle, pathname, response) {
    if (typeof handle[pathname] === 'function') {
      handle[pathname](response);
    } else {
      response.writeHead(404, head);
      response.write("<i>NOT FOUND</i>");
    }
  };
  return {init: init};
};
exports.init = router().init;