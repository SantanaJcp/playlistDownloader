var path = require("path");
var fs = require("fs");
var ytdl = require("youtube-dl");

function playlist(url) {
  "use strict";
  var video = ytdl(url);

  video.on("error", function error(err) {
    console.log("error 2:", err);
  });

  var size = 0;
  video.on("info", function(info) {
    __filename = info.title;
    console.log(size);

    var output = path.join(__dirname + "/", __filename + ".mp4");
    video.pipe(fs.createWriteStream(output));
  });

  var pos = 0;
  video.on("data", function data(chunk) {
    pos += chunk.length;
    // `size` should not be 0 here.
    if (size) {
      var percent = ((pos / size) * 100).toFixed(2);
      process.stdout.cursorTo(0);
      process.stdout.clearLine(1);
      process.stdout.write(percent + "%");
    }
  });

  video.on("next", playlist);
}

playlist(
  "https://www.youtube.com/playlist?list=PLj80s7SZOqGSKC_MLMHn8tNizXDF7Y7mC"
);
