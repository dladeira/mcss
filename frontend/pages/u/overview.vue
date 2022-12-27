<template>
    <NuxtLayout name="server">
        <div class="page">

            <div class="dials">
                <OverviewDial name="CPU" :value="activeServer.stats.cpuUsage + '%'" color="#00C2FF" />
                <OverviewDial name="RAM" :value="activeServer.stats.ramUsage + '%'" color="#00FF75" />
                <OverviewDial name="Storage" :value="activeServer.stats.storageUsage + '%'" color="#FF3030" />
                <OverviewDial name="Uptime" :value="activeServer.stats.uptime + '%'" color="#FFC700" />
            </div>

            <div class="graphs">
                <OverviewUsage />
                <div class="panel players">
                    {{ activeServer.stats.graphs.days }}
                </div>
            </div>

            <div class="misc">
                <div class="panel live-chat">

                </div>

                <div class="panel storage">

                </div>

                <div class="panel lifetime">

                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
$gap: 1rem;

.page {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    height: calc(100vh - 90px);

    padding: 2rem 0;
}

.panel {
    background-color: $gray6;
}

.dials,
.graphs,
.misc {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    height: 100%;
}

.dials {
    width: 10rem;

    margin-right: $gap;
}

.dial {
    margin-bottom: $gap;
}

.dial:last-child {
    margin: 0;
}

.graphs {
    width: 60%;

    margin-right: $gap;
}

.players {
    height: 50%;
    width: 100%;
}

.misc {
    width: 30%;
}

.live-chat {
    height: 60%;
    width: 100%;

    margin-bottom: $gap;
}

.storage {
    height: calc(25% - ($gap / 2));
    width: 100%;

    margin-bottom: $gap;
}

.lifetime {
    height: calc(15% - ($gap / 2));
    width: 100%;
}
</style>

<script setup>
const activeServer = useState('activeServer')
</script>