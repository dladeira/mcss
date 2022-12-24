<template>
    <div class="wrapper">
        <UserNavbar />
        <div class="page" v-if="user">
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

    background-color: $dark1;

    overflow-x: hidden;
}

.page {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    width: 1600px;
    max-width: 90%;

    margin: 0 auto;
}
</style>

<script setup>
const user = useState("user")
const servers = useState("servers")

const token = useCookie("token", {
    maxAge: 2592000,
    sameSite: 'lax'
})

const activeServerCookie = useCookie("activeServer", {
    maxAge: 2592000,
    sameSite: 'lax'
})

const activeServer = useState("activeServer")

if (!token.value || token.value.length == 0)
    navigateTo("/")

async function getUserData() {
    const { data, error } = await useFetch("/api/auth/user", {
        method: "GET",
        credentials: "same-origin"
    })

    if (error.value) {
        console.log("Forbidden user data")
        return navigateTo("/")
    }

    user.value = data.value.user
}

async function getServerData() {
    const { data, error } = await useFetch('/api/servers/get', {
        method: "GET",
        credentials: "same-origin"
    })

    if (error.value) {
        console.log("Forbidden server data")
        return navigateTo("/")
    }

    servers.value = data.value.servers

    if (!activeServerCookie.value || !servers.value.find(server => activeServerCookie.value._id == server._id)) {
        if (servers.value.length > 0) {
            activeServer.value = servers.value[0]
            activeServerCookie.value = servers.value[0]
        }
    } else {
        activeServer.value = activeServerCookie.value
    }
}

onBeforeMount(() => {
    setTimeout(() => {
        getUserData()
        getServerData()
    }, 1)
})</script>