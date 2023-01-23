<template>
    <div>

        <Head>
            <Title>Servers</Title>
        </Head>

        <NuxtLayout name="user">

            <div class="stats">
                <div class="stat">
                    <h1 class="stat-title">
                        <span class="stat-green">0</span>/{{ 0 }}
                    </h1>

                    <h2 class="stat-subtitle">
                        BungeeCord Slots
                    </h2>
                </div>
                <div class="stat">
                    <h1 class="stat-title">
                        <span class="stat-green">{{ servers.length }}</span>/{{ user.plan.serverSlots }}
                    </h1>

                    <h2 class="stat-subtitle">
                        Server Slots
                    </h2>
                </div>
                <div class="stat">
                    <h1 class="stat-title">
                        <span class="stat-blue">{{ servers.reduce((acc, obj) => acc + obj.storage, 0) }}</span>/{{ user.plan.storage }}MB
                    </h1>

                    <h2 class="stat-subtitle">
                        Storage Used
                    </h2>
                </div>
            </div>

            <div class="servers">
                <div class="sh">
                    <a class="sh-servers sh-link" :class="currentPanel == 'servers' ? 'sh-active' : ''" @click="setPanel('servers')">
                        Servers
                    </a>

                    <a class="sh-create sh-link" :class="currentPanel == 'create' ? 'sh-active' : ''" @click="createServer()">
                        Create Server
                    </a>
                </div>

                <ServersCreate />

                <div v-if="currentPanel == 'servers'" class="panel">
                    <ServersServer v-for="server in servers" :name="server.name" :_id="server._id" :stats="server.stats" @settings="openSettings(server._id)" />
                </div>
                <div v-if="currentPanel == 'settings'" class="panel">
                    <ServersSettings :server="serverSettings" />
                </div>
            </div>
        </NuxtLayout>
    </div>
</template>

<style lang="scss" scoped>
.stats {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 35rem;

    margin: 2rem auto 1rem;
}

.stat {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    width: 10rem;

    margin: 0;

    &-title {
        margin: 0;

        font-size: 1.5rem;
        font-weight: 600;
        color: $gray2;
    }

    &-subtitle {
        font-size: 0.75rem;
        font-weight: 400;
        color: rgba(white, 0.5);
    }

    &-green {
        font-weight: 700;
        color: $green;
    }

    &-blue {
        font-weight: 700;
        color: $blue;
    }
}

.servers {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    margin: 0 auto;

    width: 65vw;
}

.sh {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;

    width: 100%;
    margin-bottom: 2rem;
    padding-bottom: 1rem;

    border-bottom: 1px solid rgba($gray2, 0.4);

    &-servers {
        font-size: 1.5rem;
        font-weight: 600;
        color: rgba(white, 0.5);
        margin: 0;
    }

    &-create {
        font-size: 1rem;
        font-weight: 500;
        color: rgba(white, 0.5);
        margin: 0;
    }

    &-link {
        &:hover {
            cursor: pointer;
        }
    }

    &-active {
        color: white !important;
    }
}

.panel {
    width: 100%;
}
</style>

<script setup>
const user = useState('user')
const servers = useState("servers")
const currentPanel = ref("servers")
const serverSettings = ref("")
const popupCreateServer = useState("popupCreateServer", () => false)

function createServer() {
    popupCreateServer.value = true
}

function setPanel(panel) {
    currentPanel.value = panel
}

function openSettings(serverId) {
    serverSettings.value = servers.value.find(i => i._id == serverId)
    setPanel("settings")
}
</script>