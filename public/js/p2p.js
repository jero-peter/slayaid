var identity;
var customerUuid;
var currentActiveUser;
var activePeer;
var config = {
    host: '127.0.0.1',
    port: 6001,
    path: '/',
    secure : false
};
var streamObject;
var connectedPeer;

launch();

async function launch() {
    var head = document.getElementsByTagName("head")[0];

    var script = document.querySelector('[script-id="SPA-slayvault"]');
    identity = script.getAttribute("identity");
    customerUuid = script.getAttribute("customer-id");
    var customerCompany = script.getAttribute("customer-company");
    var customerName = script.getAttribute("customer-name");

    script.removeAttribute("identity");
    script.removeAttribute("customer-id");
    script.removeAttribute("customer-company");
    script.removeAttribute("customer-name");

    var form = new FormData();
    form.append("uuid", customerUuid);
    form.append("company", customerCompany);
    form.append("name", customerName);
    var xhr = new XMLHttpRequest();

    xhr.open("POST",'https://support.saaslay.test/api/identity-verification',true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Authorization", "Bearer " + atob(identity));

         xhr.onreadystatechange = await function () {
        // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            currentActiveUser = JSON.parse(xhr.response).you;

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
                createRoomButton.onclick = function () { createRoom() };
                createRoomButton.role = "button";
                createRoomButton.innerHTML = "&#10068";
                document.body.appendChild(createRoomButton);

                var shareScreenButton = document.createElement("button");
                shareScreenButton.classList.add("fixed-bottom", "p-3", "btn", "btn-success", "text-white", "px-2", "py-1", "ms-4", "rounded-circle", "float-end");
                shareScreenButton.name = "share-screen";
                shareScreenButton.id = "share-screen";
                shareScreenButton.onclick = function () { startScreenShare() };
                shareScreenButton.role = "button";
                shareScreenButton.innerHTML = "&#10150";
                document.body.appendChild(shareScreenButton);

                var audioStream = document.createElement("video");
                audioStream.id = "audio-stream";
                audioStream.autoplay = "autoplay";
                document.body.appendChild(audioStream);

                document.getElementById("share-screen").style.display = "none";
            }, 1000);
        }
    };
    xhr.send(form);
}


 function createRoom(){
    activePeer = new Peer(currentActiveUser.uuid, config);
    activePeer.on('open', () => {
        activePeer.on('call', function(call) {
            connectedPeer = call;
            var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
            getUserMedia({ audio : true}, function (stream) {
                call.answer(stream);
                call.on('stream', function(stream){
                    audioStream = document.getElementById('audio-stream');
                    audioStream.srcObject = stream;
                });
                document.getElementById("share-screen").style.display = "block";
            }, function(error){
                console.log(error);
            });
        });
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
    createCursorImg.id = "cursorImg";
    createCursorImg.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABzUlEQVR4XpWTT2iSYRzHP4Y6t7JLw4NCXRYrZl2adJ+jUVTEDuHuQUHsFgRBEEGNLalwM3UrijG0Fv1Z9Mc61CUiWKbnbeYke41OQk1998731+tlaLje7QNfntP3w4/f8zyIyHoeTM9omNPU2UYDtVrNOj0Tl6l79z1sjmaBpmmcPHEcp9NZiMTuBrYuWFujo6OdY0cH6OzclbgTnUxsSaDXdKqVCsvLeQaO+Nnb1RUYD0cKmxeIoKqr/P6zwsJiFq+3B19vr+d2aELCkZjHVIDoqKsqbXYbiFAsFnG5XPT3+wEK4+Fo4P8T6IZArQvs2I3YbDaq1TLtDgf+vr76chOhicizDQUiGAKNNqNQqZRxGOfbd+958vQ5r14nKZVKAKdowPrvDupTKMovvmYynB4cxNuznzfJZOxmcGwKAGD4/LmNdiCslMuk0hm9+EOZzeXz7Ovuxu12DwGphrQWWCwwP/+Fz58+nr0xNnIhnc7g3LGdgwe8O0dGg0OmtyBiQVGUucezjx4C37PfspMLi0sc9vnqzzxu+jGAQ8Ae1sEdCkdl7sVLuXT5yodWHSvNpGhGyeVy8Z+Ksvv6tatnaIEVE24FRy8CDiBLC/4C3kjgJkXCw9gAAAAASUVORK5CYII=');
    document.getElementById("cursorDiv").appendChild(createCursorImg);

    var createCursorSpan = document.createElement("span");
    createCursorSpan.classList.add("text-dark");
    createCursorSpan.id = "cursorText";
    createCursorSpan.innerHTML = "Agent";
    document.getElementById("cursorDiv").appendChild(createCursorSpan);
}

function startScreenShare(){

    navigator.mediaDevices.getDisplayMedia({ video: true })
    .then(stream =>{
        activePeer.call(connectedPeer.peer, stream);
        prepareAgentActionObjects();
    });

    // activePeer.on('connection')
    activePeer.on('connection', () => {
        activePeer.on('data', (data) => {
            if(data.mouse){
                let docY = $(document).height();
                let docX = $(document).width();
                factorX = docX/data.mouse.x;
                factorY = docY/data.mouse.y;
                mouseCursor.style.left = data.mouse.xMouse * factorX + 'px'; 
                mouseCursor.style.top = data.mouse.yMouse * factorY + 'px';

                if(data.mouse.click){

                    mouseCursor.style.display = 'none';

                    let offset = getOffset();
                    
                    let myElement = document.elementFromPoint(offset.x,offset.y);

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

    offsetY = window.scrollY + document.querySelector('#cursorDiv').style.top.replace('px', '');
    offsetX = window.scrollX + document.querySelector('#cursorDiv').style.left.replace('px', '');

    offsetY = parseInt(offsetY);
    offsetX = parseInt(offsetX);
    return { 
        y : offsetY,
        x : offsetX
    }
}
