server = function () {
  var
  http = require("http"),
  url = require("url"),

  // head = {"content-type": "text/plain"},

  singleInject = function (fun, inj) {
    var arg = inj;
    fun();
  },

  


  init = function (route, handle) {
    onRequest = function (request, response) {
      var
      pathUrl = request.url,
      path = url.parse(pathUrl).pathname;
      route(handle, path, response);
      // response.writeHead(200, head);
      // response.write("1");
      response.end();
    };
    server = http.createServer(onRequest);
    server.listen(8080);
  };

  return {init: init};
};
exports.init = server().init;