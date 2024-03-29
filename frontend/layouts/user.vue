<template>
    <div class="wrapper">
        <NotificationSystem />
        <UserNavbar />

        <div v-if="serversPending" class="loading">
            Loading server data
        </div>

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
    position: relative;
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    width: 1600px;
    max-width: 90%;

    margin: 0 auto;

    font-family: 'Inter', sans-serif;

    overflow: hidden;
}

.loading {
    position: absolute;
    left: 50%;
    top: 15vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    font-size: 2rem;
    color: rgba(white, 0.8);

    transform: translateX(-50%);

    opacity: 0;

    animation-name: opacity-keyframes;
    animation-duration: 2.5s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;

    &-finished {
        opacity: 1;
    }
}
</style>

<style>
.loading-frame {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 80px;
    width: 80px;

    margin: 0;
    margin-top: 2rem;
}

.loading-track {
    position: absolute;

    display: inline-block;

    height: 80px;
}

.loading-dot {
    height: 12px;
    width: 12px;
    background-color: white;
    border-radius: 100%;
    opacity: 1;
}

.loading-dot-animated {
    animation-name: opacity-keyframes;
    animation-direction: alternate;
    animation-duration: 0.75s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
}

@keyframes opacity-keyframes {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>

<script setup>
const demo = useState("demo")
const user = useState("user")
const servers = useState("servers")
const activeServer = useState("activeServer")
const config = useRuntimeConfig()
const serversPending = ref()

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
        console.log("Forbidden user data")
        token.value = ""
        return navigateTo("/")
    }

    user.value = data.value.user
}

async function getServerData() {
    if (!servers.value) {
        const { pending, data, error } = useLazyFetch(config.public.origin + '/api/servers/get', {
            method: "POST",
            credentials: "same-origin",
            body: {
                token: getToken(),
                demo: demo.value
            },
            server: false
        })

        watch(error, () => {
            if (error.value) {
                console.log("Forbidden server data")
                token.value = ""
                return navigateTo("/")
            }
        })

        serversPending.value = pending.value

        watch(pending, () => {
            serversPending.value = pending.value
        })

        watch(data, () => {
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
        })
    } else {
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
}

function getToken() {
    return token.value && token.value.length > 0 ? token.value : undefined
}

getUserData()
getServerData()
</script>