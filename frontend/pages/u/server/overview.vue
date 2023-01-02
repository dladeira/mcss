<template>

    <Head>
        <Title>{{ activeServer.name }} - Overview</Title>
    </Head>

    <NuxtLayout name="server">
        <div class="page">

            <div class="dials">
                <OverviewDial name="CPU" :value="activeServer.stats.live.cpuUsage + '%'" color="#00C2FF" />
                <OverviewDial name="RAM" :value="activeServer.stats.live.ramUsage + '%'" color="#00FF75" />
                <OverviewDial name="Storage" :value="activeServer.stats.cache.storageUsage + '%'" color="#FF3030" />
                <OverviewDial name="Uptime" :value="activeServer.stats.cache.uptime + '%'" color="#FFC700" />
            </div>

            <div class="graphs">
                <OverviewUsage />
                <OverviewPlayers />
            </div>

            <div class="misc">
                <OverviewChat />
                <OverviewStorage />
                <OverviewDataLifetime />
            </div>
        </div>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
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

.graphs {
    width: 60%;

    margin-right: $gap;
}

.misc {
    width: 30%;
}
</style>

<script setup>
const activeServer = useState('activeServer')
</script>