const peer = new Peer();
let peerId; 
let myConnection = null;
let currentPeer;
let videoInit = document.getElementById("share-stream");
let screenNormalY = window.pageYOffset + Math.floor(videoInit.getBoundingClientRect().top);
let screenNormalX = window.pageXOffset + Math.floor(videoInit.getBoundingClientRect().left);

function showCoordinates(event){
    if(myConnection !== null){
        let videoFeed = document.getElementById("share-stream");
        var x = event.clientX;
        var y = event.clientY;
        myConnection.send({x : x - screenNormalX , xWin : videoFeed.scrollWidth, y : y - screenNormalY, yWin : videoFeed.scrollHeight});
    }
}

function flushCoordinates(event){
    if(myConnection !== null){
        let videoFeed = document.getElementById("share-stream");
        myConnection.send({x : 0 , xWin : videoFeed.scrollWidth, y : 0, yWin : videoFeed.scrollHeight});
    }
}

function connect(){
    let room = document.getElementById("room-input").value;
    dataConnection = peer.connect(room);
    myConnection = dataConnection;
}

peer.on('open', function(id) {
    document.getElementById("room-input").value = id;
});

peer.on('call', function(call){
    call.answer();
    call.on('stream', function(stream){
    let video = document.getElementById("share-stream");
        video.srcObject = stream;
        video.play();
    });
});

peer.on('connection', function(connection){
    console.log('Peer connected');
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        peer.call(connection.peer, stream)
        cursor = document.getElementById("cursorDiv");
        cursor.style.display = 'block';
    });
    connection.on('open', function() {
        console.log('Data connection established');
        var cursorText = document.getElementById("cursorText");
        cursorText.innerText = "Hi there";
        setTimeout(()=>{ cursorText.innerText = '';},3000);
        connection.on('data', function(data) {
            var cursor = document.getElementById("cursorDiv");
            xWin = data.xWin;
            yWin = data.yWin;
            winX = screen.availWidth;
            winY = screen.availHeight;
            winNormalY = screen.height - screen.availHeight;
            factorX = winX/xWin;
            factorY = winY/yWin;
            myY = data.y - winNormalY;
            cursor.style.left = data.x  * factorX + 'px';
            cursor.style.top = myY  * factorY +  'px';
        });
    });
});




