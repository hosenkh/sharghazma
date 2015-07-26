(function () {
  var
  server = require("./server"),
  router = require("./router"),
  requestHandler = require("./requestHandlers"),
  handler = {
    "/": requestHandler.home,
    "/home": requestHandler.home,
    "/upload": requestHandler.upload
  },

  init = function () {
    server.init(router.init, handler);
  };
  return {init: init};
})().init();
