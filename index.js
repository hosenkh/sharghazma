(function () {
  var
  server = require("./server"),
  router = require("./router"),
  requestHandler = require("./requestHandlers"),
  handler = {
    "/": requestHandler.main,
    "/db": requestHandler.db,
    "/restricted": requestHandler.restricted,
    "/login": requestHandler.login,
    "/logout": requestHandler.logout
  },

  init = function () {
    server.init(router.init, handler);
  };
  return {init: init};
})().init();
