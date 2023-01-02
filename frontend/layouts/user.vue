<template>
    <div class="wrapper">
        <UserNavbar />
        <div class="page" v-if="user && servers">
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
const config = useRuntimeConfig()

const token = useCookie("token", {
    maxAge: 2592000,
    sameSite: 'lax'
})

const activeServerCookie = useCookie("activeServer", {
    maxAge: 2592000,
    sameSite: 'lax',
})

const activeServer = useState("activeServer")

if (!token.value || token.value.length == 0)
    navigateTo("/")

async function getUserData() {
    const { data, error } = await useFetch(config.public.origin + '/api/auth/user', {
        method: "POST",
        credentials: "same-origin",
        body: {
            token: token.value
        },
    })

    if (error.value) {
        console.log("Forbidden user data")
        return navigateTo("/")
    }
    user.value = data.value.user
}


async function getServerData() {
    const { data, error } = await useFetch(config.public.origin + '/api/servers/get', {
        method: "POST",
        credentials: "same-origin",
        body: {
            token: token.value
        },
    })

    if (error.value) {
        console.log("Forbidden server data")
        return navigateTo("/")
    }

    servers.value = data.value.servers

    const foundActiveServer = servers.value.find(server => activeServerCookie.value == server._id)

    if (!foundActiveServer) {
        if (servers.value.length > 0) {
            const defaultServer = servers.value[0]

            activeServer.value = defaultServer
            activeServerCookie.value = defaultServer._id
        }
    } else {
        activeServer.value = foundActiveServer
    }
}

getUserData()
getServerData()
</script>