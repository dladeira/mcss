<template>
    <div class="panel">
        <h1 class="panel-title">
            Player Activity (past 24h)
        </h1>

        <div class="question">
            <span class="question-mark">?</span>
        </div>

        <div class="front">
            <h1 class="front-title">
                {{ formatNumber(getEngagementScore()) }}
            </h1>
            <h3 class="front-label">
                Egagement Score
            </h3>
            <div class="front-change">
                <span :class="get24h() > 0 ? 'positive' : get24h() < 0 ? 'negative' : 'neutral'">{{ getSign(get24h()) + formatNumber(Math.abs(get24h())) }}</span> vs last 24h
            </div>
            <div class="front-change">
                <span :class="getLastWeek() > 0 ? 'positive' : getLastWeek() < 0 ? 'negative' : 'neutral'">{{ getSign(getLastWeek()) + formatNumber(Math.abs(getLastWeek())) }}</span> vs last week
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.panel {
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

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

.question {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;

    display: flex;
    justify-content: center;
    align-items: center;

    height: 1.5rem;
    width: 1.5rem;

    border-radius: 1000px;

    background-color: rgba($blue, 0.2);
    font-weight: 700;

    &:hover {
        cursor: pointer;
        user-select: none;
    }
}

.front {
    margin-left: 1vw;
}

.front-title {
    margin: 0.5rem 0 0;

    font-size: 4rem;
    font-weight: 700;
    line-height: 5rem;
    color: rgba(white, 0.9);
}

.front-label {
    margin: 0 0 1rem;

    font-size: 1rem;
    font-weight: 400;
    color: $gray1;
}

.front-change {
    margin: 0 0 0.25rem;

    font-size: 1rem;
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

function getEngagementScore(daysElapsed = 1, daysSkipped = 0) {
    const { players } = activeServer.value.stats
    const list = []
    const now = Date.now()

    for (var player of players) {
        if (now - player.lastOnline < daysElapsed * 24 * 60 * 60 * 1000)
            list.push(calculatedEngagement(player, daysElapsed, daysSkipped))
    }

    return getAverage(list)
}

function calculatedEngagement(player, daysElapsed, daysSkipped) {
    var blocksBroken = 0
    var blocksPlaced = 0

    var timestamps = []
    for (var timestamp of activeServer.value.stats.timeline) {
        if ((Date.now() - timestamp.time < (daysElapsed + daysSkipped) * 24 * 60 * 60 * 1000) && (Date.now() - timestamp.time > daysSkipped * 24 * 60 * 60 * 1000)) {
            timestamps.push(timestamp)
        }
    }

    for (var timestamp of timestamps) {
        const statsPlayer = timestamp.stats.playerStats.find(i => i.uuid == player.uuid)

        if (statsPlayer) {
            blocksBroken += statsPlayer.blocksBroken
            blocksPlaced += statsPlayer.blocksPlaced
        }
    }

    return Math.min(blocksBroken / (150 * daysElapsed) + blocksPlaced / (100 * daysElapsed), 1) * 100
}

function getAverage(arr) {
    if (arr.length > 0)
        return arr.reduce((acc, obj) => acc + obj) / arr.length
    return 0
}

function get24h() {
    var diff = getEngagementScore(1) - getEngagementScore(2, 1)
    return diff
}

function getLastWeek() {
    var diff = getEngagementScore(14, 7) - (getEngagementScore(14) - getEngagementScore(7))
    return diff
}

function formatNumber(num) {
    return Math.round(num * 10) / 10
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