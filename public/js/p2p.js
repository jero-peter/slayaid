let peer;
let userMediaStream = navigator.getUserMedia;
let connection;
let screenSharing = false;
let remoteUserMedia = document.getElementById("main-video");
let currentPeer;
let peerListArray = [];
let peerIdArrayList = [];
let iAmHost = false;
let agentDataConnection;
let connectionObj;
let agentChatBox = document.getElementById("agent-chat");
let mouseCursor;
let currentActiveUser;
let head = document.getElementsByTagName("head")[0];

var peerJs = document.createElement("script");
peerJs.type = "text/javascript";
peerJs.src = "https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js";
head.append(peerJs);

let config = {
    host: "127.0.0.1",
    port: 6001,
    path: "/",
    secure: false,
};

launch();

function launch() {
    let head = document.getElementsByTagName("head")[0];

    var script = document.querySelector('[script-id="SPA-slayvault"]');
    var identity = script.getAttribute("identity");
    var customerUuid = script.getAttribute("customer-id");
    var customerCompany = script.getAttribute("customer-company");
    var customerName = script.getAttribute("customer-name");

    script.removeAttribute("identity");
    script.removeAttribute("customer-id");
    script.removeAttribute("customer-company");
    script.removeAttribute("customer-name");

    let form = new FormData();
    form.append("uuid", customerUuid);
    form.append("company", customerCompany);
    form.append("name", customerName);
    var xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        `https://support.saaslay.test/api/identity-verification`,
        true
    );

    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + atob(identity));

    xhr.onreadystatechange = function () {
        // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            currentActiveUser = JSON.parse(xhr.response);

            var peerJs = document.createElement("script");
            peerJs.type = "text/javascript";
            peerJs.src = "https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js";

            head.append(peerJs);

            var p2p = document.createElement("script");
            p2p.type = "text/javascript";
            p2p.src = "https://support.saaslay.test/js/p2p.js";

            head.append(p2p);

            setTimeout(() => {
                var createRoomButton = document.createElement("button");
                createRoomButton.class =
                    "fixed-bottom p-3 btn btn-success text-white px-2 py-1 rounded-circle float-end";
                createRoomButton.name = "create-room";
                createRoomButton.id = "create-room";
                createRoomButton.onclick = "createRoom()";
                createRoomButton.role = "button";
                createRoomButton.createTextNode("&#10068;");
                document.body.appendChild(createRoomButton);

                var shareScreenButton = document.createElement("button");
                shareScreenButton.class =
                    "fixed-bottom p-3 btn btn-success text-white px-2 py-1 rounded-circle float-end";
                shareScreenButton.name = "share-screen";
                shareScreenButton.id = "share-screen";
                shareScreenButton.onclick = "startScreenShare()";
                shareScreenButton.role = "button";
                shareScreenButton.createTextNode("&#10150;");
                document.body.appendChild(shareScreenButton);

                document.getElementById("#share-screen").style.display = "none";
                // $('body').append('<button name="create-room" id="create-room" class="fixed-bottom p-3 btn btn-success text-white px-2 py-1 rounded-circle float-end" onclick="createRoom()" role="button">&#10068;</button>');
                // $('body').append('<button name="share-screen" id="share-screen" class="fixed-bottom p-3 btn btn-success text-white px-2 py-1 rounded-circle" onclick="startScreenShare()" role="button">&#10150;</button>');
                // $("#share-screen").hide();
            }, 1000);
        }
    };
    xhr.send(form);
}

function createRoom() {
    peer = new Peer(currentActiveUser.cc_uuid, config);
    prepareAgentActionObjects();
    mouseCursor = document.getElementById("cursorDiv");
    iAmHost = true;
    disableAllButtons("Host");
    peer.on("open", () => {
        peer.on("call", (callObj) => {
            currentPeer = callObj;
            userMediaStream({ video: true, audio: true }, (stream) => {
                callObj.answer(stream);
                connectionObj = peer.connect(callObj.peer);
                clientInstanceCreator(callObj);
            });
        });
    });
    $("#share-screen").show();
}

function startScreenShare() {
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        screenStream = stream;
        let videoTrack = screenStream.getVideoTracks()[0];
        videoTrack.onended = () => {
            stopScreenSharing();
        };
        if (iAmHost == true) {
            if (peerListArray.length > 0) {
                peerListArray.forEach((currentPeer) => {
                    let sender = currentPeer.peerConnection
                        .getSenders()
                        .find(function (s) {
                            return s.track.kind == videoTrack.kind;
                        });
                    sender.replaceTrack(videoTrack);
                    screenSharing = true;
                    connectionObj.send({ sharing: true });
                });
            }
        } else {
            let sender = currentPeer.peerConnection
                .getSenders()
                .find(function (s) {
                    return s.track.kind == videoTrack.kind;
                });
            sender.replaceTrack(videoTrack);
            screenSharing = true;
        }
    });
}
