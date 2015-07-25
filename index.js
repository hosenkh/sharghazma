(function () {
  var
  server = require("./server"),
  router = require("./router"),

  init = function () {
    server.init();
  };
  return {init: init};
})().init();
