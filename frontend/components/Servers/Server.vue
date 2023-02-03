<template>
    <div class="container">
        <div class="header">
            <div class="name">
                <h1 class="title">
                    {{ name }}
                </h1>
                <p class="id">
                    {{ _id }}
                </p>
            </div>
            <div class="tags">
                <div class="tag tag-status">
                    Online
                </div>
                <div class="tag tag-level">
                    Server
                </div>
            </div>
        </div>

        <div class="dials">
            <ServersDial :id="'dial-servers-cpu-' + name" :percent="stats.live.cpuUsage" color="blue" hex="#00C2FF" />
            <ServersDial :id="'dial-servers-ram-' + name" :percent="stats.live.ramUsage" color="green" hex="#00FF75" />
            <ServersDial :id="'dial-servers-storage-' + name" :percent="stats.cache.storageUsage" color="red" hex="#FF3030" />
        </div>

        <div class="buttons">
            <div class="button button-dashboard" @click="openDashboard">
                Dashboard
            </div>

            <div class="button button-settings" @click="$emit('settings')">
                Server Settings
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

    background-color: $panel;

    &:hover {
        background-color: lighten($panel, 2);
        box-shadow: 0 0 20px 0 rgba(black, 0.2);
    }
}

.header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    width: 100%;
}


.title {
    margin: 0;

    font-size: 1.5rem;
    font-weight: 700;
}

.id {
    margin: 0.25rem 0 0;

    font-size: 0.75rem;
    font-style: italic;
    color: $gray1;
}

.tags {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    margin-left: 1.5rem;
}

.tag {
    margin: 0.25rem 0;
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

// ==========

.dials {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: fit-content;
}

// ==========

.buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    width: 100%;
}

.button {
    height: 100%;
    width: fit-content;

    padding: 0.75rem 1.25rem;

    border-radius: 5px;

    font-size: 0.75rem;
    font-weight: 500;
    background-color: rgba(white, 0.1);
    color: white;

    &-dashboard {
        margin-right: 1rem;

        background-color: rgba($green, 0.5);

        &:hover {
            background-color: rgba($green, 0.4);
        }
    }

    &-settings {
        background-color: rgba($blue, 0.5);

        &:hover {
            background-color: rgba($blue, 0.4);
        }
    }

    &:hover {
        cursor: pointer;
    }
}
</style>

<script setup>
const config = useRuntimeConfig()
const servers = useState("servers")
const activeServer = useState("activeServer")
const activeServerCookie = useCookie("activeServer", {
    maxAge: 2592000,
    sameSite: 'lax'
})

const props = defineProps({
    name: String,
    _id: String,
    stats: Object
})

function openDashboard() {
    activeServerCookie.value = servers.value.find(server => server._id == props._id)
    activeServer.value = servers.value.find(server => server._id == props._id)
    navigateTo('/u/server/overview')
}
</script>