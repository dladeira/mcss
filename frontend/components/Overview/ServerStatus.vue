<template>
    <div class="panel">
        <h1 class="panel-title">
            Server Status (now)
        </h1>

        <div class="stats">
            <div class="dials">
                <div class="dial">
                    <h2 class="dial-title blue">CPU</h2>
                    <OverviewServerStatusDial id="overviewDial-cpu" :percent="activeServer.stats.live.cpuUsage" color="blue" hex="#00C2FF" />
                </div>

                <div class="dial">
                    <h2 class="dial-title green">RAM</h2>
                    <OverviewServerStatusDial id="overviewDial-ram" :percent="activeServer.stats.live.ramUsage" color="green" hex="#00FF75" />
                </div>
                <div class="dial">
                    <h2 class="dial-title red">Storage</h2>
                    <OverviewServerStatusDial id="overviewDial-storage" :percent="activeServer.stats.cache.storageUsage" color="red" hex="#FF3030" />
                </div>
            </div>
            <div class="players">
                <h2 class="players-title">Players</h2>
                <div class="players-text">
                    <span class="playerCount">17</span>
                    <span class="playerMax">/20</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.panel {
    grid-column: 1 / 3;
    grid-row: 1 / 2;

    border-radius: 5px;

    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.25);
}

.panel-title {
    margin: 1rem 0 0 1rem;

    font-size: 1rem;
    font-weight: 400;
}

.stats {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    width: 90%;

    margin: 0.75rem auto 0 1rem;
}

.dials {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
}

.dial {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: fit-content;

    margin: 0 1rem;
}

.dial-title {
    width: fit-content;

    margin: 0 0 1rem;
}

.players {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    height: 100%;
}

.players-title {
    margin: 0;

    font-size: 1.5rem;
    font-weight: 700;
    color: $gold;
}

.players-text {
    margin-top: 2.25rem;
}

.playerCount {
    font-size: 4rem;
    font-weight: 700;
    color: $gold;
}

.playerMax {
    font-size: 2rem;
    font-weight: 700;
    color: $gray1;
}

.blue {
    color: $blue;
}

.green {
    color: $green;
}

.red {
    color: $red;
}
</style>

<script setup>
const activeServer = useState('activeServer')
</script>