<template>
<div>
    <h5 class="text-white">Hi {{userData.name}}, Welcome to the agent dashboard!</h5>
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

        }
    }
}
</script>