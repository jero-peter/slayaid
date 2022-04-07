let head = document.getElementsByTagName('head')[0];

var peerJs = document.createElement("script");
peerJs.type = "text/javascript";
peerJs.src = "https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js";

head.append(peerJs);

let config = {
    host: '127.0.0.1',
    port: 6001,
    path: '/',
    secure : false
};

