<template>
    <div>
        <NuxtLayout name="server">

            <Head>
                <Title>{{ activeServer.name }} - Players</Title>
            </Head>

            <div class="grid">
                <div class="left">
                    <PlayersGlobalStats />
                    <PlayersPlayerList />
                </div>
                <div class="right">
                    <PlayersPlayerActivity />
                    <PlayersSessionStats />
                    <PlayersRecentEvents />
                </div>
            </div>
            <PlayersPlayerCard />
        </NuxtLayout>
    </div>
</template>

<style lang="scss" scoped>
.grid {
    display: grid;
    grid-template-columns: minmax(0, 80fr) minmax(0, 20fr);
    grid-template-rows: minmax(0, 1fr);
    grid-gap: 1.25rem;

    height: calc(100vh - 90px);
    width: 100%;

    padding: 0.5rem 0 1rem;
}

.left {
    display: grid;
    grid-template-rows: minmax(0, 20fr) minmax(0, 80fr);
    grid-gap: 1.25rem;
    grid-column: 1 / 2;

    height: 100%;
    width: 100%;
}

.right {
    display: grid;
    grid-template-rows: minmax(0, 30fr) minmax(0, 30fr) minmax(0, 40fr);
    grid-gap: 1.25rem;
    grid-column: 2 / 3;

    height: 100%;
    width: 100%;
}

.panel {
    background-color: $panel;
}
</style>

<script setup>
const activeServer = useState('activeServer')
</script>