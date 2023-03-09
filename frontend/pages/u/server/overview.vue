<template>
    <NuxtLayout name="server">

        <Head>
            <Title>{{ activeServer.name }} - Overview</Title>
        </Head>

        <div class="grid">
            <OverviewServerStatus />
            <OverviewPopulation />
            <OverviewNewPlayers />
            <OverviewPlayers />
            <OverviewServerUsage />
        </div>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr);
    grid-template-rows: minmax(0, 30fr) minmax(0, 30fr) minmax(0, 40fr);
    grid-gap: 1.25rem;

    height: calc(100vh - 90px);
    width: 100%;

    padding: 0.5rem 0 1rem;
}

.panel {
    background-color: $panel;
}
</style>

<script setup>
const activeServer = useState('activeServer')

definePageMeta({
    pageTransition: {
        name: 'blur'
    },
    layout: 'user'
})
</script>