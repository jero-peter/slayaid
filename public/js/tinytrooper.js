let head = document.getElementsByTagName('head')[0];

let tinyTrooperMode;

var fullApp = document.createElement("script");
fullApp.type = "text/javascript";
fullApp.src = "https://testsupport.dcix.in/js/query.js";

head.append(fullApp);

var peerJs = document.createElement("script");
peerJs.type = "text/javascript";
peerJs.src = "https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js";

head.append(peerJs);


var p2pwc = document.createElement("script");
p2pwc.type = "text/javascript";
p2pwc.src = "https://testsupport.dcix.in/js/p2pwc.js";

head.append(p2pwc);

setTimeout(()=>{
    tinyTrooperMode = true;
    $('body').append('<button name="create-room" id="create-room" class="fixed-bottom p-3 btn btn-success text-white px-2 py-1 rounded-circle float-end" onclick="createRoom()" role="button">&#10068;</button>');
    $('body').append('<button name="share-screen" id="share-screen" class="fixed-bottom p-3 btn btn-success text-white px-2 py-1 rounded-circle" onclick="startScreenShare()" role="button">&#10150;</button>');
    $("#share-screen").hide();
},1000);