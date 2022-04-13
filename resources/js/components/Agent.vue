<template>
<div>
    <h5 class="text-white">Hi {{userData.name}}, Welcome to the Agent dashboard!<button class="text-white btn-success btn float-end" @click.prevent="supportModeActive = !supportModeActive;"><span v-if="supportModeActive == true">Support Mode</span><span v-else>Chat Mode</span></button></h5>
    <div class="container" v-if="supportModeActive === true">
        <div class="row text-white mt-5">
            <div class="col-10 my-auto">
                <video :srcObject.prop="localStream" autoplay></video>
                <audio :srcObject.prop="clientVoice" autoplay></audio>
            </div>
            <div class="col-2">
                <ul class="list-unstyled text-center">
                    <li class="list-item btn btn-secondary text-white" v-for="client in clientData" :key="client.id" @click.prevent="connectToTheClient(client.uuid)">{{client.name}}</li>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>


<script>

import {peerjs} from 'peerjs';

export default {
    props : ['data', 'user', 'token'],
    data() {
        return {

            //Static Data Components
            userData : JSON.parse(this.user),
            supportToken : this.token,
            agentData : JSON.parse(this.data).agents,
            clientData : JSON.parse(this.data).clients,
            netSocketConfiguration : {
                host: '127.0.0.1',
                port: 6001,
                path: '/',
                secure : false
            },

            //support Mode variables
            mediaStream : navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia,
            supportModeActive : false,
            you : '',
            call : '',
            localStream : '',
            clientVoice : '',
        }
    },
    methods : {
        async connectToTheClient(uuid){
            this.you = new Peer(this.userData.uuid, this.netSocketConfiguration);
            if(this.supportModeActive == true){
                let selfRef = this;

                this.mediaStream({ audio: true }, function(stream) {
                    selfRef.call = selfRef.you.call(uuid, stream);
                    selfRef.call.on('stream', function(audioStream) {
                        selfRef.clientVoice = audioStream;
                    });
                },function(err) {
                    console.log('Failed to get local stream' ,err);
                });

                this.you.on('call', function(call) {
                    call.answer();
                    call.on('stream', function(videoStream){
                        selfRef.localStream = videoStream;
                    })
                });
            }
        }
    }
}
</script>