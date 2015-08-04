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
      console.log(path);
      route(handle, path, response);
    };
    server = http.createServer(onRequest);
    server.listen(8082);
  };

  return {init: init};
};
exports.init = server().init;