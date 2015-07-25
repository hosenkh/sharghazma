server = function () {
  var
  http = require("http"),
  url = require("url"),

  head = {"content-type": "text/plain"},

  onRequest = function (request, response) {
    var
    pathUrl = request.url,
    path = url.parse(pathUrl).pathname;
    route(path);
    response.writeHead(200, head);
    response.write(path);
    response.end();
  },

  server = http.createServer(onRequest);

  init = function (route) {
    server.listen(8081);
  };

  return {init: init};
};
exports.init = server().init;