<template>
<div>
    <h5 class="text-white">Hi {{userData.name}}, Welcome to the administrator dashboard!<button class="text-white btn-success btn float-end" @click.prevent="snippetVisible = !snippetVisible;">Snippet</button></h5>
    <code class="text-white" v-if="snippetVisible == true">
        &lt;script script-id="SPA-slayvault" identity="{{supportToken}}" customer-id="client-uuid" customer-company="client-company" customer-name="client-name" src="https://support.saaslay.com/js/p2p.js"&gt;&lt;/script&gt;
    </code>
    
</div>
    
</template>


<script>
export default {
    props : ['data', 'user', 'token'],
    data() {
        return {
            userData : JSON.parse(this.user),
            supportToken : this.token,
            agentData : '',
            clientData : '',
            snippetVisible : false,
        }
    }
}
</script>