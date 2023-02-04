<template>
    <div class="wrapper">
        <NotificationSystem />
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

    font-family: 'Inter', sans-serif;
}
</style>

<script setup>
const demo = useState("demo")
const user = useState("user")
const servers = useState("servers")
const activeServer = useState("activeServer")
const config = useRuntimeConfig()

const token = useCookie("token", {
    maxAge: 2592000,
    sameSite: 'lax'
})

const activeServerCookie = useCookie("activeServer", {
    maxAge: 2592000,
    sameSite: 'lax',
})


if (!getToken() && !demo.value)
    navigateTo("/")

async function getUserData() {
    const { data, error } = await useFetch(config.public.origin + '/api/auth/user', {
        method: "POST",
        credentials: "same-origin",
        body: {
            token: getToken(),
            demo: demo.value
        },
    })

    if (error.value) {
        // console.log("Forbidden user data")
        // token.value = ""
        // return navigateTo("/")
    }

    user.value = data.value.user
}

async function getServerData() {
    if (!servers.value) {
        const { data, error } = await useFetch(config.public.origin + '/api/servers/get', {
            method: "POST",
            credentials: "same-origin",
            body: {
                token: getToken(),
                demo: demo.value
            },
        })

        if (error.value) {
            // console.log("Forbidden server data")
            // token.value = ""
            // return navigateTo("/")
        }
        servers.value = data.value.servers
    }

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

function getToken() {
    return token.value && token.value.length > 0 ? token.value : undefined
}

getUserData()
getServerData()
</script>