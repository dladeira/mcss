<template>
    <div class="wrapper">
        <div class="page">
            <LandingNavbar />
            <slot />
        </div>
        <Footer />
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    position: relative;
    display: flex;
    flex-direction: column;

    min-height: calc(100vh + 140px);
    width: 100%;


    overflow-x: hidden;
}

.page {
    width: 1200px;
    max-width: 70%;

    margin: 0 auto;
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