(function () {
  var
  server = require("./server"),
  router = require("./router"),
  requestHandler = require("./requestHandlers"),
  handler = {
    "/": requestHandler.main,
    "/ajax": requestHandler.ajax
  },

  init = function () {
    server.init(router.init, handler);
  };
  return {init: init};
})().init();
