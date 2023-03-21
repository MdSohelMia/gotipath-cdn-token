import "./style.css";
import "video.js/dist/video-js.css";
import date from "date-and-time";
import videojs from "video.js";
import { HmacSHA1, MD5 } from "crypto-js";
//CDN Base url Path.
var baseUrl = "https://fdjjhzpkjf.gpcdn.net";
//CDN Token
var secret_key = "a1ekujgxrjpx2nzk7yj2g8bc1ugohlypq2woigdeiaogaecl1eaysbw49chto5cj"; //CDN secret key generated from gotipath portal.

function generate20CharHmacSha1(resource, secret_key) {
    var encrypted = HmacSHA1(resource, secret_key).toString();
    return encrypted.substring(0, 20);
}

function md5(path) {
    const expires = Math.floor(Date.now() / 1000) + 10000;
    const link = `${expires}${path} ${secret_key}`;
    const md5 = CryptoJS.MD5(link);
    const base64 = md5.toString(CryptoJS.enc.Base64);
    const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `md5=${urlSafeBase64}&expires=${expires}`;
}
//Final url
function generateFinalUrl(path) {
    let stime = new Date();
    stime =  date.addMinutes(stime, -5);
    stime.toLocaleString("en-US", { timeZone: "UTC" });
    let etime = date.addMinutes(stime, 10);
    stime = date.format(stime, "YYYYMMDDHHmmss", true);
    etime = date.format(etime, "YYYYMMDDHHmmss", true);
    var resource = path + `?stime=${stime}&etime=${etime}&${md5(path)}`;
    var token = generate20CharHmacSha1(resource, secret_key);
    return `${baseUrl}${resource}&encoded=0${token}`;
}

let player = videojs("my-video", {
    html5: {
        nativeAudioTracks: false,
        nativeVideoTracks: false,
        vhs: {
            debug: true,
            overrideNative: true
        }
    }
});


videojs.Vhs.xhr.beforeRequest = (options) => {
    const url = new URL(options.uri);
    let pathName = url.pathname
    if (!options.uri.includes("stime")) {
        options.uri = generateFinalUrl(pathName);
        return options;
    }
    return options;
};


player.ready(function () {
    this.src({
        src: generateFinalUrl("/8d814d09-e734-4628-93c5-2fa9977a53e9/playlist.m3u8"),
        type: "application/x-mpegURL",
        withCredentials: false
    });
});
