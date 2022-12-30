<template>
    <NuxtLayout name="server">
        <div class="page">
            <div class="top">
                <PlayersUsage />
                
                <PlayersList />
            </div>
            <div class="bottom">
                <PlayersPlayerStats />
                <PlayersChatStats />
                <div class="adv panel">

                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    height: calc(100vh - 90px);

    padding: 2rem 0;
}

.panel {
    background-color: $gray6;
}

.top, .bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    width: 100%;
}

.top {
    height: 55%;

    margin-bottom: $gap;
}

.bottom {
    height: 45%;
}

.players, .chat, .adv {
    height: 100%;
    width: calc((100% / 3) - ($gap * 2 / 3))
}
</style>

<script setup>
const activeServer = useState('activeServer')
</script>