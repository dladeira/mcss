<template>
    <NuxtLayout name="user">
        <!-- <div class="plan">
            <span class="plan-premium">Premium</span> Plan
        </div>
        <nuxt-link class="plan-upgrade" to="/u/plans">Upgrade</nuxt-link> -->

        <div class="stats">
            <div class="stat">
                <h1 class="stat-title">
                    <span class="stat-green">0</span>/1
                </h1>

                <h2 class="stat-subtitle">
                    BungeeCord Slots
                </h2>
            </div>
            <div class="stat">
                <h1 class="stat-title">
                    <span class="stat-green">2</span>/5
                </h1>

                <h2 class="stat-subtitle">
                    Server Slots
                </h2>
            </div>
            <div class="stat">
                <h1 class="stat-title">
                    <span class="stat-blue">2.5</span>/10GB
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

                <a class="sh-create sh-link" :class="currentPanel == 'create' ? 'sh-active' : ''" @click="setPanel('create')">
                    Create Server
                </a>
            </div>

            <div v-if="currentPanel == 'servers'" class="panel panel-servers">
                <ServersServer v-for="server in servers" :name="server.name"/>
            </div>
            <div v-if="currentPanel == 'settings'" class="panel panel-settings">
                bing
            </div>
            <div v-if="currentPanel == 'create'" class="panel panel-create">
                <ServersCreate />
            </div>
        </div>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.plan {
    width: fit-content;

    margin: 3rem auto 1rem auto;
    padding: 1rem 2rem;

    border-radius: 1000px;

    font-size: 2rem;
    font-weight: 600;
    background-color: rgba($blue, 0.1);
    color: white;

    &-premium {
        color: $blue;
    }

    &-upgrade {
        margin: 0 auto;

        font-size: 0.75rem;
        font-weight: 300;
        text-decoration: none;
        color: $blue;
    }
}

.stats {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 40rem;

    margin: 2rem auto;
}

.stat {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    width: 10rem;

    margin: 0;

    font-size: 1.5rem;

    &-title {
        margin: 0;

        font-size: 1.5rem;
        font-weight: 400;
        color: $gray2;
    }

    &-subtitle {
        font-size: 1rem;
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

    width: 56rem;
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
const currentPanel = ref("servers")
const servers = useState("servers")

function setPanel(panel) {
    currentPanel.value = panel
}
</script>