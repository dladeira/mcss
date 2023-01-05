<template>
    <div class="container">
        <div class="header">
            <h2 class="title">
                Player Stats
            </h2>
        </div>
        <div class="columns">
            <div class="column">
                <div class="data">
                    <div class="key">
                        Players joined
                    </div>
                    <div class="value">
                        {{ activeServer.stats.cache.players.length }}
                    </div>
                </div>
                <div class="data">
                    <div class="key">
                        Players peak
                    </div>
                    <div class="value">
                        {{ activeServer.stats.cache.playerPeak }}
                    </div>
                </div>
                <div class="data">
                    <div class="key">
                        Time played
                    </div>
                    <div class="value">
                        {{ Math.round(activeServer.stats.cache.totalPlaytime / 360) / 10 }}h
                    </div>
                </div>
                <div class="data">
                    <div class="key">
                        AVG Time played
                    </div>
                    <div class="value">
                        {{  Math.round(Math.round(activeServer.stats.cache.totalPlaytime / 360) / 10 / activeServer.stats.cache.players.length * 10) / 10 }}h
                    </div>
                </div>
            </div>

            <div class="column">
                <div class="data">
                    <div class="key">
                        Blocks broken
                    </div>
                    <div class="value">
                        {{ activeServer.stats.cache.blocksBroken }}
                    </div>
                </div>
                <div class="data">
                    <div class="key">
                        Blocks placed
                    </div>
                    <div class="value">
                        {{ activeServer.stats.cache.blocksPlaced }}
                    </div>
                </div>
                <div class="data">
                    <div class="key">
                        Blocks traveled
                    </div>
                    <div class="value">
                        {{ activeServer.stats.cache.blocksTraveled }}
                    </div>
                </div>
                <div class="data">
                    <div class="key">
                        Deaths
                    </div>
                    <div class="value">
                        {{ activeServer.stats.cache.deaths }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
    align-items: center;

    height: 100%;
    width: calc((100% / 3) - ($gap * 2 / 3));

    background-color: $gray6;
}

.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
}

.title {
    width: fit-content;

    font-size: 1.25rem;
    font-weight: 700;


    margin: 10px 0 0 18px;
}

.columns {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    height: 100%;
    width: 65%;

    margin: 1rem 0 1.5rem;
}

.column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    height: 100%;
}

.key {
    font-size: 1rem;
    font-weight: 400;
    color: white;
}

.value {
    font-size: 1.25rem;
    font-weight: 700;
    color: $green;
}
</style>

<script setup>
const activeServer = useState('activeServer')
</script>