<template>
    <div>
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.empty {
    color: white;
}
</style>

<script setup>
const demo = useState("demo")
const token = useCookie("token", {
    maxAge: 2592000,
    sameSite: 'lax'
})
const servers = useState('servers')
const user = useState('user')
const serversPending = useState('serversPending')

function getToken() {
    return token.value && token.value.length > 0 ? token.value : undefined
}

if (getToken() || demo.value) {
    navigateTo("/u/servers")
} else {
    user.value = undefined
    servers.value = undefined
    serversPending.value = undefined
}
</script>