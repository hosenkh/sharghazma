router = function () {
  var

  init = function (pathname) {
    console.log(pathname);
  };
  return {init: init};
};
exports.init = router().init;