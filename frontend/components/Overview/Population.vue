<template>
    <div class="panel">
        <h1 class="panel-title">
            Population (past 24h)
        </h1>

        <div class="stats">
            <div class="front">
                <h1 class="front-title">
                    {{getRecurringPlayers()}}
                </h1>
                <h3 class="front-label">
                    recurring players
                </h3>
                <div class="front-change">
                    <span :class="getPlayerDiff() > 0 ? 'positive' : getPlayerDiff() < 0 ? 'negative' : 'neutral'">{{ getPlayerDiff() }}</span> vs last 24h
                </div>
            </div>

            <div class="back">
                <h1 class="back-title">
                    {{getNewPlayers()}}
                </h1>
                <h3 class="back-label">
                    new players
                </h3>
                <div class="back-change">
                    <span :class="getNewPlayerDiff() > 0 ? 'positive' : getNewPlayerDiff() < 0 ? 'negative' : 'neutral'">{{ getNewPlayerDiff() }}</span> vs last 24h
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.panel {
    grid-column: 1 / 2;
    grid-row: 2 / 3;

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
    justify-content: flex-start;
    align-items: flex-start;

    margin: 0.5rem 0 0 1.5vw;
}

.front {
    margin-right: 1vw;
}

.front-title {
    margin: 0.5rem 0 0;

    font-size: 5.5rem;
    font-weight: 700;
    line-height: 6rem;
    color: rgba(white, 0.9);
}

.front-label {
    margin: 0 0 0.5rem;

    font-size: 1.25rem;
    font-weight: 400;
    color: $gray1;
}

.front-change {
    font-size: 1.25rem;
    font-weight: 400;
    color: white;
}

.back-title {
    margin: 1.5rem 0 0;

    font-size: 3rem;
    font-weight: 700;
    line-height: 2.5rem;
    color: rgba(white, 0.9);
}

.back-label {
    font-size: 0.75rem;
    font-weight: 400;
    color: $gray1;
}

.back-change {
    font-size: 0.75rem;
    font-weight: 400;
    color: white;
}

.positive {
    font-weight: 700;
    color: $green;
}

.negative {
    font-weight: 700;
    color: $red;
}

.neutral {
    font-weight: 700;
    color: white;
}
</style>

<script setup>
const activeServer = useState('activeServer')

function getRecurringPlayers(daysElapsed = 1) {
    const { players } = activeServer.value.stats
    const list = []
    const now = Date.now()

    for (var player of players) {
        console.log(player.username + " joined " + (Math.round((now - player.joined) / 1000 / 60 / 60 * 10) / 10) + " hours ago")

        if (now - player.lastOnline < daysElapsed * 24 * 60 * 60 * 1000)
            list.push(player)
    }

    return list.length - getNewPlayers()
}

function getNewPlayers(daysElapsed = 1) {
    const { players } = activeServer.value.stats
    const list = []
    const now = Date.now()

    for (var player of players) {
        console.log(player.username + " joined " + (Math.round((now - player.joined) / 1000 / 60 / 60 * 10) / 10) + " hours ago")

        if (now - player.joined < daysElapsed * 24 * 60 * 60 * 1000)
            list.push(player)
    }

    return list.length
}

function getPlayerDiff() {
    const change = getRecurringPlayers(1) - (getRecurringPlayers(2) - getRecurringPlayers(1))
    return getSign(change) + Math.abs(change)
}

function getNewPlayerDiff() {
    const change = getNewPlayers(1) - (getNewPlayers(2) - getNewPlayers(1))
    return getSign(change) + Math.abs(change)
}

function getSign(num) {
    if (num > 0) {
        return "+"
    } else if (num < 0) {
        return "-"
    } else {
        return "~"
    }
}
</script>