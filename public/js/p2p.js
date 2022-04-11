let peer;
let userMediaStream = navigator.getUserMedia;
let connection;
let screenSharing = false;
let remoteUserMedia = document.getElementById('main-video');
let currentPeer;
let peerListArray = [];
let peerIdArrayList = [];
let iAmHost = false;
let agentDataConnection;
let connectionObj; 
let agentChatBox = document.getElementById('agent-chat');
let mouseCursor;
let tinyMode;
let currentActiveUser;
let config = {
    host: '127.0.0.1',
    port: 6001,
    path: '/',
    secure : false
};
let tinyTrooperMode;
let head = document.getElementsByTagName("head")[0];
var identity;
var customerUuid;

var peerJs = document.createElement("script");
peerJs.type = "text/javascript";
peerJs.src = "https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js";
head.append(peerJs);

launch();


function launch() {
    let head = document.getElementsByTagName("head")[0];

    var script = document.querySelector('[script-id="SPA-slayvault"]');
    identity = script.getAttribute("identity");
    customerUuid = script.getAttribute("customer-id");
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
                createRoomButton.classList.add("fixed-bottom", "p-3", "btn", "btn-success", "text-white", "px-2", "py-1","rounded-circle", "float-end");
                createRoomButton.name = "create-room";
                createRoomButton.id = "create-room";
                createRoomButton.onclick = createRoom();
                createRoomButton.role = "button";
                createRoomButton.innerHTML = "&#10068";
                document.body.appendChild(createRoomButton);

                var shareScreenButton = document.createElement("button");
                shareScreenButton.classList.add("fixed-bottom", "p-3", "btn", "btn-success", "text-white", "px-2", "py-1", "rounded-circle", "float-end");
                shareScreenButton.name = "share-screen";
                shareScreenButton.id = "share-screen";
                shareScreenButton.onclick = startScreenShare();
                shareScreenButton.role = "button";
                shareScreenButton.innerHtml = "&#10150";
                document.body.appendChild(shareScreenButton);

                document.getElementById("share-screen").style.display = "none";
                // $('body').append('<button name="create-room" id="create-room" class="fixed-bottom p-3 btn btn-success text-white px-2 py-1 rounded-circle float-end" onclick="createRoom()" role="button">&#10068;</button>');
                // $('body').append('<button name="share-screen" id="share-screen" class="fixed-bottom p-3 btn btn-success text-white px-2 py-1 rounded-circle" onclick="startScreenShare()" role="button">&#10150;</button>');
                // $("#share-screen").hide();
            }, 1000);
        }
    };
    xhr.send(form);
}

function createRoom() {
    peer = new Peer(currentActiveUser.uuid, config);
    // prepareAgentActionObjects();
    mouseCursor = document.getElementById("cursorDiv");
    iAmHost = true;
    disableAllButtons("Host");
    peer.on("open", () => {
        peer.on("call", (callObj) => {
            currentPeer = callObj;
            userMediaStream(
                {
                    video: true,
                    audio: true,
                },
                (stream) => {
                    callObj.answer(stream);
                    connectionObj = peer.connect(callObj.peer);
                    clientInstanceCreator(callObj);
                }
            );
        });
    });

    let form = new FormData();
    form.append("uuid", customerUuid);
    var xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        `https://support.saaslay.test/api/get-help`,
        true
    );

    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + atob(identity));

    xhr.onreadystatechange = function () {
        // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log(xhr);
        }
    };
    xhr.send(form);
}

function startScreenShare() {
    navigator.mediaDevices
        .getDisplayMedia({
            video: true,
        })
        .then((stream) => {
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
                        connectionObj.send({
                            sharing: true,
                        });
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


function prepareAgentActionObjects() {
    
    var createCursorDiv = document.createElement("div");
    createCursorDiv.classList.add("text-dark");
    createCursorDiv.name = "cursorDiv";
    createCursorDiv.id = "cursorDiv";
    createCursorDiv.style.position = 'absolute';
    createCursorDiv.style.top = '0';
    createCursorDiv.style.left = '0';
    createCursorDiv.style.zIndex = '9999';
    document.body.appendChild(createCursorDiv);

    var createCursorImg = document.createElement("img");
    createCursorImg.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzUlEQVR4XpWTT2iSYRzHP4Y6t7JLw4NCXRYrZl2adJ+jUVTEDuHuQUHsFgRBEEGNLalwM3UrijG0Fv1Z9Mc61CUiWKbnbeYke41OQk1998731+tlaLje7QNfntP3w4/f8zyIyHoeTM9omNPU2UYDtVrNOj0Tl6l79z1sjmaBpmmcPHEcp9NZiMTuBrYuWFujo6OdY0cH6OzclbgTnUxsSaDXdKqVCsvLeQaO+Nnb1RUYD0cKmxeIoKqr/P6zwsJiFq+3B19vr+d2aELCkZjHVIDoqKsqbXYbiFAsFnG5XPT3+wEK4+Fo4P8T6IZArQvs2I3YbDaq1TLtDgf+vr76chOhicizDQUiGAKNNqNQqZRxGOfbd+958vQ5r14nKZVKAKdowPrvDupTKMovvmYynB4cxNuznzfJZOxmcGwKAGD4/LmNdiCslMuk0hm9+EOZzeXz7Ovuxu12DwGphrQWWCwwP/+Fz58+nr0xNnIhnc7g3LGdgwe8O0dGg0OmtyBiQVGUucezjx4C37PfspMLi0sc9vnqzzxu+jGAQ8Ae1sEdCkdl7sVLuXT5yodWHSvNpGhGyeVy8Z+Ksvv6tatnaIEVE24FRy8CDiBLC/4C3kjgJkXCw9gAAAAASUVORK5CYII=');
    document.getElementById("cursorDiv").appendChild(createCursorImg);

    $('body').append('<div id="cursorDiv" class="text-dark"  style="position:absolute;top:0;left:0;z-index:9999;"><img src=""><span id="cursorText">Agent</span></div>');
}

function clientInstanceCreator(callObj){

    let checkForPresenceBoolean = document.getElementById(callObj.peer);
    if(!checkForPresenceBoolean){

        let userStreamCanvas;

        let tinyMode = typeof tinyTrooperMode !== 'undefined' ? true : false;

        if(callObj.peer == 'roomForDCIXMediaChat' && iAmHost != true && peer.id == 'AgentForDCIXMediaChat'){
            $("#video-container").append('<video autoplay="1" id="roomForDCIXMediaChat" style="cursor:none;height:100vh;width:100vw" class="col-12 p-0"></video>');
            $("#roomForDCIXMediaChat").mousemove(function (e){
                if(screenSharing == true){
                    var x = e.clientX - $('#roomForDCIXMediaChat').offset().left;
                    var y = e.clientY - $('#roomForDCIXMediaChat').offset().top;
                    var frameWidth = document.getElementById('roomForDCIXMediaChat').offsetWidth;
                    var frameHeight = document.getElementById('roomForDCIXMediaChat').offsetHeight;
                    agentDataConnection.send({ mouse : { xMouse  : x , frameY : frameHeight, yMouse : y, frameX :frameWidth}});
                }
            });
            $("#roomForDCIXMediaChat").keydown(function (e){
                if(e.key == 'Alt' || e.key == 'Shift' || e.key == 'Control' || e.key == 'CapsLock' || e.key == 'Enter'){
                    return;
                }else{
                    if(e.key == 'Space'){
                        evt = e;
                        var charCode = evt.which || evt.keyCode;
                        var charStr = String.fromCharCode(charCode);
                        agentDataConnection.send({ keypress : charStr });
                    }
                    else if(e.key == 'Tab'){
                        evt = e;
                        var charCode = evt.which || evt.keyCode;
                        var charStr = String.fromCharCode(charCode);
                        agentDataConnection.send({ keypress : charStr });

                    }else{
                        agentDataConnection.send({ keypress : e.key });
                    }
                }
            });
            $("#roomForDCIXMediaChat").click(function (e){
                if(screenSharing == true){
                    var x = e.clientX - $('#roomForDCIXMediaChat').offset().left;
                    var y = e.clientY - $('#roomForDCIXMediaChat').offset().top;
                    var frameWidth = document.getElementById('roomForDCIXMediaChat').offsetWidth;
                    var frameHeight = document.getElementById('roomForDCIXMediaChat').offsetHeight;
                    agentDataConnection.send({ mouse : { click : true, xMouse  : x , frameY : frameHeight, yMouse : y, frameX :frameWidth}});
                }
            });
            userStreamCanvas = document.getElementById('roomForDCIXMediaChat');
        }else{
            if(tinyMode == false){
                userStreamCanvas = document.createElement('video');
                userStreamCanvas.setAttribute('autoplay', 1);
                userStreamCanvas.setAttribute('id', callObj.peer);
                userStreamCanvas.classList.add('col-6');
                
                let htmlVideoContainer = document.getElementById('video-container');
        
                htmlVideoContainer.append(userStreamCanvas);
            }
        }
        if(tinyMode == false){
            callObj.on('stream', function(stream){
                userStreamCanvas.srcObject = stream;
            });
        }
    }
    
    if(iAmHost == true){
        if(callObj.peer == 'AgentForDCIXMediaChat'){
            initiateAgentControls();
        }
        peerListArray.push(callObj);
        peerIdArrayList.push(callObj.peer);
        if(peerListArray.length > 1){
            tellYourFriends();
        }
    }
}

