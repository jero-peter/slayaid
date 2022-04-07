<template>
    <div class="bg-dark container-fluid">
        <div class="row my-5">
            <h5 class="text-center text-white">Welcome to SlayAid, {{activeUser.name}} !
                <div class="d-block text-end me-5 pe-3" v-if="activeUser.user_group == 1">
                    <button class="btn text-white border rounded-2 border-white" data-bs-toggle="modal" data-bs-target="#Snippet">Snippets</button>
                    <div class="modal fade bg-dark" id="Snippet" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-xl bg-dark">
                        <div class="modal-content bg-dark text-white">
                        <div class="modal-body">
                                
                            <h4 class="text-white text-start">Snippets<a class="text-decoration-none text-white float-end my-auto" data-bs-dismiss="modal" style="cursor:pointer;">&times;</a></h4>
                            <div class="row my-2 mx-auto">
                                <input v-on:focus="$event.target.select()" type="text" class="col-8 m-0" :value="`<script src='https://support.saaslay.test/js/p2p-spa.js' customer-id='unique-user-id' customer-name='user-name' customer-company='company_name(nullable)' identity='${activeUser.t_token}' script-id='SPA-slayvault'></script>`" id="SPA">
                                <h5 class="col-2 m-0 my-auto">SPAs</h5>
                                <button class="btn btn-white text-white col-2" @click.prevent="focus('SPA')">Copy</button>
                            </div>
                            <div class="row my-2 mx-auto">
                                <input v-on:focus="$event.target.select()" type="text" class="col-8 m-0" value="Non-SPAs not supported" id="nSPA">
                                <h5 class="col-2 m-0 my-auto">Non-SPAs</h5>
                                <button class="btn btn-white text-white col-2" @click.prevent="focus('nSPA')">Copy</button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </h5>
        </div>
       <div>
            <div class="card w-25 position-absolute bottom-0 left-0 m-3" style="z-index:999" v-if="helpRequest.helpRequest === true">
                <div class="card-header">
                    <strong class="mr-auto">Incoming help request</strong>
                </div>
                <div class="card-body">
                    <span>{{helpRequest.name}} is calling you</span>
                    <button class="btn btn-success text-white" @click.prevent="helpRequest.helpRequest = false;answerHelp(helpRequest.id)">Answer</button>
                    <button class="btn btn-danger text-white" @click.prevent="helpRequest.helpRequest = false;declineHelp(helpRequest.id)">Decline</button>
                </div>
            </div>
       </div>
       <div v-if="activeUser.user_group !== 2">
            <div class="card w-25 position-absolute bottom-0 left-0 m-3" v-if="helpRequest.callStatus">
                <div class="card-header">
                    <strong class="mr-auto">Call Declined</strong>
                </div>
                <div class="card-body">
                    <span>Reason : {{helpRequest.reason}}</span>
                </div>
            </div>
            <div class="card w-25 position-absolute bottom-0 left-0 m-3" v-else-if="helpRequest.status == 'disconnected'">
                <div class="card-header">
                    <strong class="mr-auto">Call Dropped</strong>
                </div>
                <div class="card-body">
                    <span>Reason : {{helpRequest.reason}}</span>
                </div>
            </div>
       </div>
        <div class="position-relative container-fluid row" style="min-height:70vh">
            
            <div class="row container-fluid" v-if="yourStream.id !== you.id+'_stream' && inACall == true && screenSharingActive == true">
                <video class="col-12" v-if="streamMedia !== null" autoplay="1" id="exclusiveStream" :srcObject.prop="streamMedia"></video>
            </div>
            <div class="col-9 row container-fluid">
                <video class="col-6" v-for="peer in peerCollection" autoplay="1" :key="peer.id" :id="peer.id" :srcObject.prop="peer.stream"></video>
            </div>
            <div class="col-3 position-relative">
                <div v-if="activeUser.user_group !== 2">
                    <div class="row" v-if="inACall === false">
                        <h6 class="text-white text-end">Available Agents</h6>
                        <a class="text-white text-end list-group-item bg-dark btn text-capitalize" v-for="agent in availableAgents" :key="agent.id" @click.prevent="getHelp(agent.c_uuid)">{{agent.name}}</a>
                        <hr>
                        <h6 class="text-white text-end">Available Team Members</h6>
                        <div class="m-0 p-0" v-for="agent in availableUsers" :key="agent.id">
                            <a class="text-white text-end list-group-item bg-dark btn text-capitalize" v-if="activeUser.id !== agent.id"  @click.prevent="getHelpUser(agent.c_uuid)">{{agent.name}}</a>
                        </div>
                    </div>
                    <div v-else>
                        <h6 class="text-white text-end">Call in progress.</h6>
                        <button class="btn btn-primary text-white float-end mb-2" @click.prevent="screenShare()" v-if="screenSharingActive == false">Share Screen</button>
                        <div v-else>
                            <button :class="yourStream === '' ? ['d-none'] : ['btn btn-secondary text-white float-end mb-2']" @click.prevent="stopScreenShare()">Stop Sharing</button>
                            <div class="dropdown">
                                <button :class="yourStream === '' ? ['d-none'] : ['btn btn-success text-white float-end mb-2']"  type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Allow Remote</button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a class="dropdown-item" v-for="peer in peerCollection" :key="peer.peer" @click.prevent="allowRemoteAccess(peer.peer)">{{peer.peer}}</a>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-warning text-dark float-end mb-2" @click.prevent="hangUp()">Hang up.</button>
                    </div>
                </div>
                <div v-else-if="activeUser.user_group == 2">
                    <div class="row" v-if="inACall === false">
                        <h6 class="text-white text-end">Active Users</h6>
                        <a class="text-white text-end list-group-item bg-dark btn text-capitalize" v-for="client in availableClients" :key="client.id" @click.prevent="sendHelp(client.cc_uuid)">{{client.name}}</a>
                    </div>
                </div>
                <div class="row">
                    <video class="col-9 img-fluid float-end position-absolute" style="bottom:0;right:-50px" autoplay="1" :id="you.id" :srcObject.prop="localStream" muted></video>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { peerjs } from 'peerjs'; 

export default {
    props : ['cuuid', 'user'],
    data() {
        return {
            /**
             * Unchanged data
             */
            activeUser : JSON.parse(this.user),
            availableAgents : '',
            availableUsers : '',
            c_uuid : this.cuuid,
            snippet : '',

            /**
             * This is the application variable collections
            */
            you : '',
            yourStream: '',
            userMediaStream : navigator.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia,
            peerCollection : '',
            localStream : null,
            inACall : false,

            /**
             * Session based variables
            */
            currentCall : '',
            connectionObject : '',
            helpRequest : {},
            previousConnectionObject : '',
            screenSharingActive : false,
            streamMedia : '',
            config : {
                host: '127.0.0.1',
                port: 6001,
                path: '/',
                secure : false
            }
        }
    },
    methods : {
        initialDataFetch(){
            if(this.activeUser.user_group !== 2){
                axios.get(`/get-support-data/${this.c_uuid}`)
                .then(response => {
                    this.availableAgents = response.data.agents;
                    this.availableUsers = response.data.users;
                });
            }
            this.userMediaStream({ video : true, audio : true}, stream => { this.localStream = stream; });

        },
        userMode(){
            this.you = new Peer(this.c_uuid, this.config);
            this.you.on('open', ()=>{
                this.you.on('call', (callObject)=>{
                    this.currentCall = callObject;
                    this.currentCall.answer(this.localStream);
                    this.currentCall.on('stream', (stream) => {
                        if(this.peerCollection.length == 0){
                            this.inACall = true;
                            this.currentCall.stream = stream;
                            this.peerCollection = [...this.peerCollection, this.currentCall]
                        }else{
                            this.peerCollection.map(peer => {
                                if(peer.id == this.currentCall.id){
                                    return null;
                                }
                                else{
                                    this.currentCall.stream = stream;
                                    this.peerCollection = [...this.peerCollection, this.currentCall];
                                }
                            });
                        }
                    });
                });
                this.you.on('connection', (connection) => {
                    this.connectionObject = connection;
                    this.connectionObject.on('open' , () => {
                        this.connectionObject.on('data', (data) => {
                            if(data.helpRequest === true){
                                this.helpRequest = data;
                            }
                            else if(data.status == 'disconnected'){
                                this.peerCollection = this.peerCollection.filter(peer => { return peer.peer != data.disconnectionId});
                                this.connectionObject.send({ status : 'disconnected', disconnectionId : this.you.id });
                                if(this.peerCollection.length == 0){
                                    this.currentCall.close();
                                    this.inACall = false;
                                    setTimeout(()=>{
                                        this.connectionObject.close();
                                        this.you.destroy();
                                        this.userMode();
                                    },300);
                                }
                            }
                            else if(data.screenShareActive !== null){
                                if(data.screenShareActive == true){
                                    this.screenSharingActive = true;
                                    this.streamPreparation(data);
                                }else{
                                    this.streamPreparation(data)
                                }
                            }
                        });
                    });
                });
            });
        },
        getHelp(agent_id){
            this.connectionObject = this.you.connect(agent_id);
            this.connectionObject.on('open', () => {
                this.connectionObject.send({ helpRequest : true, id : this.you.id, name : this.activeUser.name });
                this.connectionObject.on('data', (data) => {
                    if(data.callStatus == 'declined'){
                        this.helpRequest = data;
                        setTimeout(()=>{
                            this.helpRequest = {};
                        },4000);
                    }
                    else if(data.status == 'disconnected'){
                        this.inACall = false;
                        if(data.reason){
                            this.helpRequest = data;
                            setTimeout(()=>{
                                this.helpRequest = {};
                            },3000);
                            this.hangUp(true, data);
                        }else{
                            this.hangUp(true, data);
                        }
                    }
                    else if(data.screenSharingActive == false){
                        this.yourStream.destroy();
                        this.streamMedia = null;
                        this.screenSharingActive = false;
                    }
                });
            });
        },
        getHelpUser(user_id){
            this.connectionObject = this.you.connect(user_id);
            this.connectionObject.on('open', () => {
                this.connectionObject.send({ helpRequest : true, id : this.you.id, name : this.activeUser.name, helpRequestType : 'user' });
                this.connectionObject.on('data', (data) => {
                    if(data.callStatus == 'declined'){
                        this.helpRequest = data;
                        setTimeout(()=>{
                            this.helpRequest = {};
                        },4000);
                    }
                    else if(data.status == 'disconnected'){
                        this.connectionObject.send({ status : 'disconnected', disconnectionId : this.you.id });
                        this.inACall = false;
                        if(data.reason){
                            this.helpRequest = data;
                            setTimeout(()=>{
                                this.helpRequest = {};
                            },3000);
                            this.hangUp(true, data);
                        }else{
                            this.hangUp(true, data);
                        }
                    }
                    else if(data.screenShareActive !== null){
                        if(data.screenShareActive == true){
                            this.screenSharingActive = true;
                            this.streamPreparation(data);
                        }else{
                            this.streamPreparation(data)
                        }
                    }
                });
            });
        },
        async hangUp(boolean, data){
            await this.connectionObject.send({ status : 'disconnected', disconnectionId : this.you.id });
            if(boolean == true){
                this.connectionObject.close();
                this.currentCall.stream = null;
                this.currentCall.close();
                this.peerCollection = this.peerCollection.filter(peer => { return peer.peer != data.disconnectionId});
                this.inACall = false;
                if(this.peerCollection.length == 0){
                    this.you.destroy();
                    this.userMode();
                    if(this.streamMedia !== ''){
                        let tracks = this.streamMedia.getTracks();
                        tracks[0].stop();
                        this.screenSharingActive = false;
                        this.streamMedia = null;
                    }
                }
            }
            if(this.helpRequest.helpRequestType){
                this.peerCollection = this.peerCollection.filter(peer => { return peer.peer != this.helpRequest.id});
                    setTimeout(()=>{
                        this.connectionObject.close();
                        this.currentCall.stream = null;
                        this.currentCall.close();
                        this.inACall = false;
                        if(this.peerCollection.length == 0){
                            this.you.destroy();
                            this.userMode();
                            if(this.streamMedia !== ''){
                                let tracks = this.streamMedia.getTracks();
                                tracks[0].stop();
                                this.screenSharingActive = false;
                                this.streamMedia = null;
                            }
                        }
                    },300);
            }
        },
        async screenShare(){
            if(this.inACall == true){
                await navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
                    this.streamMedia = stream;
                });
                this.screenSharingActive = true;
                                
                this.connectionObject.send({ screenShareActive : true, screenShareChannelId : this.you.id+'_stream' });

                this.yourStream = new Peer(this.you.id+'_stream', this.config);

                this.yourStream.on('open', () => {
                    this.yourStream.on('call', (call) =>{
                        call.answer(this.streamMedia);
                    });
                })
            }else{
                alert('Not in a call to share the screen');
            }
        },
        async stopScreenShare(){
            if(this.inACall == true){
                if(this.screenSharingActive == true){
                    this.screenSharingActive = false;
                    await this.connectionObject.send({ screenSharingActive : false, screenShareChannelId : this.you.id+'_stream' });
                    let tracks = this.streamMedia.getTracks();
                    tracks[0].stop();
                }else{
                    alert('Screen sharing not active');
                }
            }else{
                alert('Not in a call');
            }
        },
        agentMode(){
            this.you = new Peer(this.c_uuid,this.config);
            this.you.on('open', ()=>{

                this.you.on('connection', (connect) => {
                    if(this.connectionObject !== null){
                        this.previousConnectionObject = this.connectionObject;
                    }
                    this.connectionObject = connect;
                    this.connectionObject.on('open', () => {
                        this.connectionObject.on('data', (data) => {
                            if(data.helpRequest === true){
                                this.helpRequest = data;
                            }
                            else if(data.status == 'disconnected'){
                                this.peerCollection = this.peerCollection.filter(peer => { return peer.peer != data.disconnectionId});
                                this.connectionObject.send({ status : 'disconnected', disconnectionId : this.you.id });
                                if(this.peerCollection.length == 0){
                                    this.currentCall.close();
                                    this.inACall = false;
                                    setTimeout(()=>{
                                        this.connectionObject.close();
                                        this.you.destroy();
                                        this.agentMode();
                                    },300);
                                }
                            }
                            else if(data.screenShareActive !== null){
                                if(data.screenShareActive == true){
                                    this.screenSharingActive = true;
                                    this.streamPreparation(data);
                                }else{
                                    this.streamPreparation(data);
                                }
                            }
                        });
                    });
                });
               
            });
        },
        answerHelp(client_id){
            if(this.inACall == true){
                this.previousConnectionObject.send({ status : 'disconnected', reason : 'Agent switched calls', disconnectionId : this.you.id });
            }

            this.currentCall = this.you.call(client_id,this.localStream);
            this.currentCall.on('stream', (stream) =>{
                if(this.peerCollection.length == 0){
                    this.inACall = true;
                    this.currentCall.stream = stream;
                    this.peerCollection = [...this.peerCollection, this.currentCall];
                }else{
                    this.peerCollection.map(peer => {
                        if(peer.id == this.currentCall.id){
                            return null;
                        }else{
                            if(this.inACall == true){
                                this.currentCall.stream = stream;
                                this.peerCollection = [...this.peerCollection, this.currentCall];
                            }
                        }
                    });
                }
            });
        },
        streamPreparation(data){
            if(data.screenShareActive == true){
                this.yourStream = this.you.call(data.screenShareChannelId,this.localStream);
                this.yourStream.on('stream', (stream) => {
                    this.streamMedia = stream;
                });
            }else{
                if(this.streamMedia !== null){
                    this.streamMedia = null;
                    this.screenSharingActive = false;
                    this.yourStream.close();
                    this.connectionObject.send({ screenSharingActive : false });
                }else{
                    return;
                }
            }
        },
        declineHelp(){
            if(this.inACall == true){
                this.connectionObject.send({ callStatus : 'declined', reason : 'Agent busy, on another call'});
            }else{
                this.connectionObject.send({ callStatus : 'declined', reason : 'Agent declined the call request'});
            }
        },
        focus(Id){
            let element = document.getElementById(''+Id);
            element.focus();
            document.execCommand('copy');
        }
    },
    mounted() {
        this.initialDataFetch();
    },
    created(){
        if(this.activeUser.user_group !== 2){
            this.userMode();
            if(this.activeUser.user_group == 1){
            }
        }else{
            this.agentMode();
        }
    }
}
</script>