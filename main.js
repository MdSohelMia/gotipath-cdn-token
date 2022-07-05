import "./style.css";
import "video.js/dist/video-js.css";
import date from "date-and-time";
import videojs from "video.js";

import { HmacSHA1 } from "crypto-js";

function generate20CharHmacSha1(resource, secret_key) {
  var encrypted = HmacSHA1(resource, secret_key).toString();

  return encrypted.substring(0, 20);
}

function generateFinalUrl(path) {
  var baseUrl = "https://zdllthmcmb.gpcdn.net"; //CDN Base url

  var secret_key =
    "g8egehr7iec49d2g3k2kjt0c7q7mz2dnffrxbaqe8hulrt0z7bw9nad03qg6htln"; //CDN secret key generated from gotipath portal.

  let stime = new Date();
  stime.toLocaleString("en-US", { timeZone: "UTC" });
  let etime = date.addMinutes(stime, 1);
  stime = date.format(stime, "YYYYMMDDHHmmss", true);
  etime = date.format(etime, "YYYYMMDDHHmmss", true);

  var resource = path + `?stime=${stime}&etime=${etime}`;

  var token = generate20CharHmacSha1(resource, secret_key);

  return baseUrl + resource + "&encoded=" + 0 + token;
}

let player = videojs("my-video", {});

videojs.Vhs.xhr.beforeRequest = (options) => {
  const uri = options.uri.replace("https://zdllthmcmb.gpcdn.net", "");
  if (!options.uri.includes("stime")) {
    options.uri = generateFinalUrl(uri);
    return options;
  }
  return options;
};

player.ready(function () {
  this.src({
    src: generateFinalUrl("/hls/live/2000341/test/master.m3u8"),
    type: "application/x-mpegURL",
  });
});

console.log(player.tech().vhs);

// player.tech().vhs.xhr.beforeRequest = function (options) {
//   console.log(options.uri);
//   options.uri = options.uri.replace("example.com", "foo.com");

//   return options;
// };

document.querySelector("#app").innerHTML = ``;
