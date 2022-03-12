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
                console.log(e.key);
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
                // if(e.key != 'Alt' || e.key != 'Shift' || e.key != 'Control' || e.key != 'CapsLock'){
                // }
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



function initiateAgentControls(){
    connectionObj = peer.connect('AgentForDCIXMediaChat');
    connectionObj.on('open', () => {
        connectionObj.on('data', (data) => {
            if(data.mouse){
                let docY = $(document).height();
                let docX = $(document).width();
                factorX = docX/data.mouse.frameX;
                factorY = docY/data.mouse.frameY;

              
                mouseCursor.style.left = data.mouse.xMouse * factorX + 'px'; 
                mouseCursor.style.top = data.mouse.yMouse * factorY + 'px';

                if(data.mouse.click){

                    mouseCursor.style.display = 'none';

                    let offset = getOffset();
                    
                    let myElement = document.elementFromPoint(offset.x,offset.y);

                    console.log(myElement);
                    
                    if(myElement !== null){

                        myElement.click();
                        myElement.focus();
    
                        mouseCursor.style.display = 'initial';
                    }else{
                        mouseCursor.style.display = 'initial';
                    }
                }

            }
            else if(data.message){
                $("#cursorText").text(data.message);
                setTimeout(()=>{
                    $("#cursorText").text('Agent');
                },5000);
            }
            else if(data.keypress){
                let activeEl = document.activeElement;
                if(activeEl !== null){
                    if(data.keypress == 'Backspace'){
                        var currentValue = activeEl.value;
                        activeEl.value = currentValue.substr(0, currentValue.length - 1);
                        activeEl.innerText = currentValue.substr(0, currentValue.length - 1);
                        activeEl.text = currentValue.substr(0, currentValue.length - 1);
                        
                    }else{
                        activeEl.value += data.keypress;
                        activeEl.innerText += data.keypress;
                        activeEl.text += data.keypress;
                    }
                }
            }
        });
    });
}
function getOffset() {

    offsetY   =  window.scrollY + document.querySelector('#cursorDiv').style.top.replace('px', '');
    offsetX   = window.scrollX + document.querySelector('#cursorDiv').style.left.replace('px', '');

    offsetY = parseInt(offsetY);
    offsetX = parseInt(offsetX);
    return { 
        y : offsetY,
        x : offsetX
    }
}


function tellYourFriends(){
    peerListArray.forEach(peerObj => {
        connectionObj = peer.connect(peerObj.peer);
        connectionObj.on('open', () => {
            connectionObj.send({ peerList : peerIdArrayList });
        });
    });
}

function createRoom(){
    peer = new Peer('roomForDCIXMediaChat');
    prepareAgentActionObjects();
    mouseCursor = document.getElementById("cursorDiv");
    iAmHost = true;
    disableAllButtons('Host');
    peer.on('open', ()=>{
        peer.on('call', (callObj)=>{
            currentPeer = callObj;
            userMediaStream({ video : true, audio : true } , stream => {
                callObj.answer(stream);
                connectionObj = peer.connect(callObj.peer);
                clientInstanceCreator(callObj);
            });
        });
    });
    $("#share-screen").show();

}

function startScreenShare(){
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        screenStream = stream;
        let videoTrack = screenStream.getVideoTracks()[0];
        videoTrack.onended = () => {
            stopScreenSharing()
        }
        if(iAmHost == true){
            if (peerListArray.length > 0) {
                peerListArray.forEach(currentPeer => {
                    let sender = currentPeer.peerConnection.getSenders().find(function (s) {
                        return s.track.kind == videoTrack.kind;
                    });
                    sender.replaceTrack(videoTrack)
                    screenSharing = true;
                    connectionObj.send({ sharing : true });
                });
            }
        }else{
            let sender = currentPeer.peerConnection.getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            });
            sender.replaceTrack(videoTrack)
            screenSharing = true;
        }
    });
}

function stopScreenSharing(){
    if (!screenSharing) return;
    userMediaStream({ video: true, audio: true }, (stream) => {
        let videoTrack = stream.getVideoTracks()[0];
        if (peerListArray.length > 0) {
            peerListArray.forEach(currentPeer => {
                let sender = currentPeer.peerConnection.getSenders().find(function (s) {
                    return s.track.kind == videoTrack.kind;
                })
                sender.replaceTrack(videoTrack);
                connectionObj.send({ sharing : false });
            });
        }
        screenStream.getTracks().forEach(function (track) {
            track.stop();
        });
    });
}

function joinRoom(agentCheck){
    if(agentCheck == true){
        peer = new Peer('AgentForDCIXMediaChat');
        disableAllButtons('Agent');
    }else{
        peer = new Peer();
        disableAllButtons('Client');
    }
    let peerId;
    peer.on('open', (id)=>{
        peerId = id;
        userMediaStream({ video: true, audio: true }, (stream) => {
            var callObj = peer.call('roomForDCIXMediaChat', stream);
            clientInstanceCreator(callObj);
        });
    });
    peer.on('call', (callObj) => {
        currentPeer = callObj;
        userMediaStream({ video : true, audio : true } , stream => {
            callObj.answer(stream);
            clientInstanceCreator(callObj);
        });
    });

    peer.on('connection', (connection) => {
        agentDataConnection = connection;
        connection.on('open', () => {
            connection.on('data', (data) => {
                if(data.peerList){
                    data.peerList.forEach(peerObj => {
                        if(peerObj !== peerId){
                            userMediaStream({ video: true, audio: true }, (stream) => {
                                let callInstanceOfPeer = peer.call(peerObj, stream);
                                clientInstanceCreator(callInstanceOfPeer);
                            });
                        }
                    });
                }
                if(data.sharing){
                    screenSharing = data.sharing;
                }
            });
        });
    });
}


function disableAllButtons(typeOf){
    if(typeOf == 'Host'){
        var createRoomButton = document.getElementById('create-room');
        var joinRoomButton = document.getElementById('join-room');
        var agentRoomButton = document.getElementById('agent-join');
        var shareScreenButton = document.getElementById('share-screen');
        if(joinRoomButton !== null){
            joinRoomButton.style.display = 'none';
            agentRoomButton.style.display = 'none';
        }
    }
    if(typeOf == 'Agent'){
        var createRoomButton = document.getElementById('create-room');
        var joinRoomButton = document.getElementById('join-room');
        var agentRoomButton = document.getElementById('agent-join');
        var shareScreenButton = document.getElementById('share-screen');
        createRoomButton.style.display = 'none';
        joinRoomButton.style.display = 'none';
        shareScreenButton.style.display = 'none';
        agentRoomButton.style.display = 'none';
        getMeAgentControls();
    }
    if(typeOf == 'Client'){
        var createRoomButton = document.getElementById('create-room');
        var joinRoomButton = document.getElementById('join-room');
        var agentRoomButton = document.getElementById('agent-join');
        var shareScreenButton = document.getElementById('share-screen');
        createRoomButton.style.display = 'none';
        joinRoomButton.style.display = 'none';
        agentRoomButton.style.display = 'none';
    }
}

function getMeAgentControls(){
    return;
    // let agentControls = document.getElementById('agent-controls');


    // let chatBoxForAgent = document.createElement('input');
    // chatBoxForAgent.setAttribute('id', 'agent-chat');
    // chatBoxForAgent.classList.add('form-control');


    // agentControls.append(chatBoxForAgent);


    // let sendChatMessageForAgent = document.createElement('button');
    // sendChatMessageForAgent.setAttribute('onclick', 'sendMessageToHost()');
    // sendChatMessageForAgent.innerText = 'Send Message';
    // sendChatMessageForAgent.setAttribute('id', 'send-message');
    // sendChatMessageForAgent.classList.add('btn','bg-success', 'text-white' , 'my-2');


    // agentControls.append(sendChatMessageForAgent);
}


function sendMessageToHost(){
    let chatBoxForAgent = document.getElementById('agent-chat');
    let messageValue = chatBoxForAgent.value;
    agentDataConnection.send({ message  : messageValue});
}


function prepareAgentActionObjects(){
    $('body').append('<div id="cursorDiv" class="text-dark"  style="position:absolute;top:0;left:0;z-index:9999;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzUlEQVR4XpWTT2iSYRzHP4Y6t7JLw4NCXRYrZl2adJ+jUVTEDuHuQUHsFgRBEEGNLalwM3UrijG0Fv1Z9Mc61CUiWKbnbeYke41OQk1998731+tlaLje7QNfntP3w4/f8zyIyHoeTM9omNPU2UYDtVrNOj0Tl6l79z1sjmaBpmmcPHEcp9NZiMTuBrYuWFujo6OdY0cH6OzclbgTnUxsSaDXdKqVCsvLeQaO+Nnb1RUYD0cKmxeIoKqr/P6zwsJiFq+3B19vr+d2aELCkZjHVIDoqKsqbXYbiFAsFnG5XPT3+wEK4+Fo4P8T6IZArQvs2I3YbDaq1TLtDgf+vr76chOhicizDQUiGAKNNqNQqZRxGOfbd+958vQ5r14nKZVKAKdowPrvDupTKMovvmYynB4cxNuznzfJZOxmcGwKAGD4/LmNdiCslMuk0hm9+EOZzeXz7Ovuxu12DwGphrQWWCwwP/+Fz58+nr0xNnIhnc7g3LGdgwe8O0dGg0OmtyBiQVGUucezjx4C37PfspMLi0sc9vnqzzxu+jGAQ8Ae1sEdCkdl7sVLuXT5yodWHSvNpGhGyeVy8Z+Ksvv6tatnaIEVE24FRy8CDiBLC/4C3kjgJkXCw9gAAAAASUVORK5CYII="><span id="cursorText">Agent</span></div>');
}