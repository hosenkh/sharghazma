head = {"content-type": "text/plain"};
home = function (response) {
  response.writeHead(200, head);
  response.write("home");
};
uploader = function (response) {
  console.log('uploader');
};
exports.home = home;
exports.uploader = uploader;