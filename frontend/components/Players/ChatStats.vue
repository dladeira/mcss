<template>
    <div class="container">
        <div class="header">
            <h2 class="title">
                Chat Stats
            </h2>
        </div>
        <div class="columns">
            <div class="column">
                <div class="data">
                    <div class="key">
                        Messages sent
                    </div>
                    <div class="value">
                        {{ activeServer.stats.cache.messages }}
                    </div>
                </div>
                <div class="data">
                    <div class="key">
                        Characters sent
                    </div>
                    <div class="value">
                        {{ activeServer.stats.cache.characters }}
                    </div>
                </div>
                <div class="data">
                    <div class="key">
                        Whispers sent
                    </div>
                    <div class="value">
                        {{ activeServer.stats.cache.whispers }}
                    </div>
                </div>
                <div class="data">
                    <div class="key">
                        Commands sent
                    </div>
                    <div class="value">
                        {{ activeServer.stats.cache.commands }}
                    </div>
                </div>
            </div>

            <div class="column">
                <div class="data">
                    <div class="key">
                        Messages/hour
                    </div>
                    <div class="value">
                        {{ Math.round(activeServer.stats.cache.messages / (activeServer.stats.cache.runningTime / 1000 / 3600) * 10) / 10 }}
                    </div>
                </div>
                <div class="data">
                    <div class="key">
                        Characters/hour
                    </div>
                    <div class="value">
                        {{ Math.round(activeServer.stats.cache.characters / (activeServer.stats.cache.runningTime / 1000 / 3600) * 10) / 10 }}
                    </div>
                </div>
                <div class="data">
                    <div class="key">
                        Whispers/hour
                    </div>
                    <div class="value">
                        {{ Math.round(activeServer.stats.cache.whispers / (activeServer.stats.cache.runningTime / 1000 / 3600) * 10) / 10 }}
                    </div>
                </div>
                <div class="data">
                    <div class="key">
                        Commands/hour
                    </div>
                    <div class="value">
                        {{ Math.round(activeServer.stats.cache.commands / (activeServer.stats.cache.runningTime / 1000 / 3600) * 10) / 10 }}
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

    margin: 1rem 0 1.5rem 0;
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