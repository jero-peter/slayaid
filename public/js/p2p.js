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

setTimeout(()=>{ launch(); },2000);

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
                shareScreenButton.classList.add("fixed-bottom", "p-3", "btn", "btn-success", "text-white", "px-2", "py-1", "rounded-circle", "float-end");
                shareScreenButton.name = "share-screen";
                shareScreenButton.id = "share-screen";
                shareScreenButton.onclick = function () { startScreenShare() };
                shareScreenButton.role = "button";
                shareScreenButton.innerHTML = "&#10150";
                document.body.appendChild(shareScreenButton);

                document.getElementById("share-screen").style.display = "none";
            }, 1000);
        }
    };
    xhr.send(form);
}


 function createRoom(){
    navigator.mediaDevices.getDisplayMedia({ video: true })
    .then(stream =>{
        activePeer = new Peer(currentActiveUser.uuid, config);
        activePeer.on('open', () => {
            activePeer.on('call', function(call) {
                call.answer(stream);
            });
        });
    });
}
