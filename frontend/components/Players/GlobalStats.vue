<template>
    <div class="panel">
        <h1 class="panel-title">
            Global Stats (all-time)
        </h1>
        <div class="stats">
            <div class="stat">
                <h1 class="stat-title">{{ formatNumber(activeServer.stats.blocksBroken) }}</h1>
                <h2 class="stat-label">Blocks Broken</h2>
            </div>
            <div class="stat">
                <h1 class="stat-title">{{ formatNumber(activeServer.stats.blocksPlaced) }}</h1>
                <h2 class="stat-label">Blocks Placed</h2>
            </div>
            <div class="stat">
                <h1 class="stat-title">{{ formatNumber(activeServer.stats.blocksTraveled) }}</h1>
                <h2 class="stat-label">Blocks Traveled</h2>
            </div>
            <div class="stat">
                <h1 class="stat-title">{{ formatTime(activeServer.stats.totalPlaytime) }}</h1>
                <h2 class="stat-label">Time Played</h2>
            </div>
            <div class="stat">
                <h1 class="stat-title">{{ formatNumber(activeServer.stats.messages) }}</h1>
                <h2 class="stat-label">Messages Sent</h2>
            </div>
            <div class="stat">
                <h1 class="stat-title">{{ formatNumber(activeServer.stats.deaths) }}</h1>
                <h2 class="stat-label">Deaths</h2>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.panel {
    height: 100%;
    width: 100%;

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

    margin: 1rem auto 0rem auto;
}

.stat {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.stat-title {
    width: fit-content;

    margin: 0;

    font-size: 2.75rem;
    font-weight: 700;
    color: rgba(white, 0.9);
}

.stat-label {
    width: fit-content;

    margin: 0.5rem 0 0;

    font-size: 1rem;
    font-weight: 400;
    color: $gray1;
}
</style>

<script setup>
const activeServer = useState('activeServer')

function formatNumber(number) {
    var lead = 0
    var unit = ""

    if (number >= 1000000) {
        lead = number / 1000000
        unit = "m"
    } else if (number >= 1000) {
        lead = number / 1000
        unit = "k"
    } else {
        lead = number
        unit = ""
    }

    return Number(lead.toPrecision(2)) + unit
}

function formatTime(seconds) {
    var lead = 0
    var unit = ""
    if (seconds >= 86400) {
        lead = seconds / 86400
        unit = "d"
    } else if (seconds >= 3600) {
        lead = seconds / 3600
        unit = "h"
    } else if (seconds >= 60) {
        lead = seconds / 60
        unit = "m"
    } else {
        lead = seconds
        unit = "s"
    }

    return lead.toPrecision(2) + unit
}
</script>