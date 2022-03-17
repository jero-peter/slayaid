<template>
    <div class="bg-dark container-fluid">
        <div class="row-fluid justify-content-center my-5">
            <h5 class="text-center text-white">Welcome to SlayAid, {{activeUser.name}} !</h5>        
        </div>
       <div v-if="activeUser.user_group === 2">
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
                    <strong class="mr-auto">Call declined</strong>
                </div>
                <div class="card-body">
                    <span>Reason : {{helpRequest.reason}}</span>
                </div>
            </div>
       </div>
        <div class="position-relative container-fluid row" style="min-height:70vh">
            <div class="col-9 row container-fluid">
                <video class="col-6" v-for="peer in peerCollection" autoplay="1" :key="peer.id" :id="peer.id" :srcObject.prop="peer.stream"></video>
            </div>
            <div class="col-3 position-relative">
                <div v-if="activeUser.user_group !== 2">
                    <div class="row" v-if="inACall === false">
                        <h6 class="text-white text-end">Available Agents</h6>
                        <a class="text-white text-end list-group-item bg-dark btn text-capitalize" v-for="agent in availableAgents" :key="agent.id" @click.prevent="getHelp(agent.c_uuid)">{{agent.name}}</a>
                    </div>
                    <div v-else>
                        <h6 class="text-white text-end">Call in progress.</h6>
                        <div class="fixed-bottom container">
                            <button class="btn btn-warning text-dark" @click.prevent="hangUp()">Hang up.</button>
                        </div>
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
            c_uuid : this.cuuid,

            /**
             * This is the application variable collections
            */
            you : '',
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
        }
    },
    methods : {
        initialDataFetch(){
            if(this.activeUser.user_group !== 2){
                axios.get(`/get-support-data/${this.c_uuid}`)
                .then(response => {
                    this.availableAgents = response.data.agents;
                });
            }
            this.userMediaStream({video : true, audio : true}, stream => { this.localStream = stream; });

        },
        userMode(){
            this.you = new Peer(this.c_uuid);
            this.you.on('open', ()=>{
                this.you.on('call', (callObject)=>{
                    this.currentCall = callObject;
                    this.currentCall.answer(this.localStream);
                    this.currentCall.on('stream', (stream) => {
                        if(this.peerCollection.length == 0){
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
            });
        },
        getHelp(agent_id){
            this.inACall = true;
            this.connectionObject = this.you.connect(agent_id);
            this.connectionObject.on('open', () => {
                this.connectionObject.send({ helpRequest : true, id : this.you.id, name : this.activeUser.name });
                this.connectionObject.on('data', (data) => {
                    if(data.callStatus == 'declined'){
                        this.helpRequest = data;
                        this.inACall = false;
                        setTimeout(()=>{
                            this.helpRequest = {};
                        },4000);
                    }
                    else if(data.status == 'disconnected'){
                        this.hangUp(true, data);
                    }
                });
            });
        },
        hangUp(boolean, data){
            this.connectionObject.send({ status : 'disconnected', disconnectionId : this.you.id });
            if(boolean == true){
                this.connectionObject.close();
                this.currentCall.close();
                console.log(this.peerCollection.length);
                this.peerCollection = this.peerCollection.filter(peer => { return peer.peer != data.disconnectionId});
                this.inACall = false;
                if(this.peerCollection.length == 0){
                    this.userMode();
                }
            }
        },
        agentMode(){
            this.you = new Peer(this.c_uuid);
            this.you.on('open', ()=>{
                this.you.on('connection', (connect) => {
                    this.connectionObject = connect;
                    this.connectionObject.on('open', () => {
                        this.connectionObject.on('data', (data) => {
                            if(data.helpRequest === true){
                                this.helpRequest = data;
                            }
                            else if(data.status == 'disconnected'){
                                this.peerCollection = this.peerCollection.filter(peer => { return peer.peer != data.disconnectionId});
                                this.connectionObject.send({status : 'disconnected', disconnectionId : this.you.id});
                                console.log(this.peerCollection.length);
                                if(this.peerCollection.length == 0){
                                    this.currentCall.close();
                                    setTimeout(()=>{
                                        this.connectionObject.close();
                                    },300);
                                }
                            }
                        });
                    });
                });
               
            });
        },
        answerHelp(client_id){
            this.currentCall = this.you.call(client_id,this.localStream);
            this.currentCall.on('stream', (stream) =>{
                if(this.peerCollection.length == 0){
                    this.inACall = true;
                    this.currentCall.stream = stream;
                    this.peerCollection = [...this.peerCollection, this.currentCall];
                    console.log('One detected');
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
        declineHelp(){
            if(this.inACall == true){
                this.connectionObject.send({ callStatus : 'declined', reason : 'Agent busy, on another call'});
            }else{
                this.connectionObject.send({ callStatus : 'declined', reason : 'Manual decline detected'});
            }
        }
    },
    mounted() {
        this.initialDataFetch();
    },
    created(){
        if(this.activeUser.user_group !== 2){
            this.userMode();
        }else{
            this.agentMode();
        }
    }
}
</script>