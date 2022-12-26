<template>
    <div class="container">
        <div class="section">
            <h1 class="title">
                {{ name }}
            </h1>
            <p class="time">
                {{ _id }}
            </p>

            <div class="tags">
                <div class="tag tag-status">
                    Online
                </div>
                <div class="tag tag-level">
                    Level 1 - Server
                </div>
            </div>

            <div class="dials">
                <div class="dial">
                    <h3 class="dial-title">
                        CPU
                    </h3>

                    <div class="dial-outer">
                        <div class="dial-inner cpu-inner">
                            <div class="usage">
                                {{ currentData ? currentData.cpuUsage : 0 }}%
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dial">
                    <h3 class="dial-title">
                        RAM
                    </h3>

                    <div class="dial-outer">
                        <div class="dial-inner ram-inner">
                            <div class="usage">
                                {{ currentData ? currentData.ramUsage : 0 }}%
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dial">
                    <h3 class="dial-title">
                        Storage
                    </h3>

                    <div class="dial-outer">
                        <div class="dial-inner storage-inner">
                            <div class="usage">
                                X
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="section section-graph">
            <div class="graph">

            </div>
        </div>
        <div class="section section-buttons">
            <div class="button button-dashboard" @click="changeServer()">
                Dashboard
            </div>

            <div class="button button-settings">
                Server Settings
            </div>

            <div class="button button-delete" @click="deleteServer">
                Delete Server
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    margin-bottom: 2rem;
    padding: 1rem 1.5rem;

    border-radius: 10px;

    background-color: $gray6;
}

.section {
    height: 100%;
}

.title {
    margin: 0;

    font-size: 1.5rem;
    font-weight: 600;
}

.time {
    margin: 0.25rem 0 0 0;

    font-size: 0.75rem;
    font-style: italic;
    color: #5B5B5B;
}

.tags {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    margin: 0.75rem 0 1rem 0;
}

.tag {
    margin-right: 1rem;
    padding: 4px 18px;

    border-radius: 1000px;

    font-size: 0.70rem;
    font-weight: 400;
}

.tag-status {
    background-color: rgba($green, 0.1);
    color: $green;
}

.tag-level {
    background-color: rgba($blue, 0.1);
    color: $blue;
}

.dials {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
}

.dial {
    margin-right: 1rem;
}

.dial-title {
    width: fit-content;

    margin: 0 auto 0.5rem auto;

    font-size: 0.75rem;
    font-weight: 400;
    color: $gray1;
}

.dial-outer {
    height: 3.75rem;
    width: 3.75rem;

    padding: 6px;

    border-radius: 1000px;

    background-color: rgba(#263559, 0.4);
}

.dial-inner {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: 100%;

    border: 3px rgba($blue, 0.8) solid;
    border-radius: 1000px;
}

.ram-inner {
    border-color: $green;
}

.storage-inner {
    border-color: $red;
}

.usage {
    font-size: 0.75rem;
}

.section-graph {
    flex-grow: 1;

    height: 10rem;

    margin: 0 3rem;

    background-color: rgba(black, 0.2);
}

.button {
    height: 100%;
    width: fit-content;

    margin-left: auto;

    border-radius: 5px;

    margin-bottom: 1rem;
    padding: 0.75rem 1.25rem;

    font-size: 0.75rem;
    font-weight: 500;
    background-color: rgba(white, 0.1);
    color: white;

    &-dashboard {
        background-color: rgba($green, 0.1);
        color: $green;
    }

    &-settings {
        background-color: rgba($blue, 0.1);
        color: $blue;
    }

    &-delete {
        background-color: rgba($red, 0.1);
        color: $red;

        margin-bottom: 0;
    }

    &:hover {
        cursor: pointer;
    }
}
</style>

<script setup>
const servers = useState("servers")
const activeServer = useState("activeServer")
const activeServerCookie = useCookie("activeServer", {
    maxAge: 2592000,
    sameSite: 'lax'
})

const props = defineProps({
    name: String,
    _id: String,
    data: Object
})

var currentData
loadCurrentData()

function loadCurrentData() {
    if (props.data && props.data.length > 0) {
        currentData = props.data.reduce((prev, current) => {
            return prev.time > current.time ? prev : current
        })
    }
}

function deleteServer() {
    if (confirm("Are you sure you want to delete this server? There is no undo option.")) {
        useFetch('http://localhost:3020/api/servers/delete', {
            method: "POST",
            body: {
                name: props.name
            }
        })

        window.location.reload(true)
    }
}

function changeServer() {
    activeServerCookie.value = servers.value.find(server => server._id == props._id)
    activeServer.value = servers.value.find(server => server._id == props._id)
    navigateTo('/u/overview')
}
</script>