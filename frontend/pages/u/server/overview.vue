<template>
    <div>
        <NuxtLayout name="server">

            <Head>
                <Title>{{ activeServer.name }} - Overview</Title>
            </Head>

            <div class="grid">
                <OverviewServerStatus class="panel serverStatus" />
                <div class="panel serverUsage">Server Usage (past 24h)</div>
                <div class="panel population">Population (past 24h)</div>
                <div class="panel newPlayers">New Players (past 24h)</div>
                <div class="panel players">Players (past week)</div>

                <!-- <div class="dials">
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
                </div> -->
            </div>
        </NuxtLayout>
    </div>
</template>

<style lang="scss" scoped>
.grid {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    grid-template-rows: 30fr 30fr 40fr;
    grid-gap: 1.25rem;

    height: calc(100vh - 90px);
    width: 100%;

    padding: 0.5rem 0 1rem;
}

.serverStatus {
    grid-column: 1 / 3;
    grid-row: 1 / 2;
}

.serverUsage {
    grid-column: 3 / 4;
    grid-row: 1 / 3;
}

.population {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
}

.newPlayers {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
}

.players {
    grid-column: 1 / 4;
    grid-row: 3 / 4;
}

.panel {
    background-color: $panel;
}
</style>

<script setup>
const activeServer = useState('activeServer')
</script>