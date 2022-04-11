<template>
<div>
    <h5 class="text-white">Hi {{userData.name}}, Welcome to the administrator dashboard!<button class="text-white btn-success btn float-end" @click.prevent="snippetVisible = !snippetVisible;">Snippet</button></h5>
    <code class="text-white" v-if="snippetVisible == true">
        &lt;script script-id="SPA-slayvault" identity="{{userData.support_token}}" customer-id="" customer-company="" customer-name="" src="https://support.saaslay.com/js/p2p.js"&gt;&lt;/script&gt;
    </code>
    
</div>
    
</template>


<script>
export default {
    props : ['data', 'user'],
    data() {
        return {
            userData : JSON.parse(this.user),
            agentData : '',
            clientData : '',
            snippetVisible : false,

        }
    }
}
</script>