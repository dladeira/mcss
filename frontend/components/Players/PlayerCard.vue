<template>
    <div class="wrapper" v-if="player" @click="clickOuter()">
        <div class="container" @click="clickInner()">
            <div class="top">
                <div class="panel username-container">
                    <img class="username-img" :src="`https://cravatar.eu/avatar/${player.username}/40.png`" />
                    <div class="username-username">{{ player.username }}</div>
                    <div class="username-country">{{ "Poland" }}</div>
                </div>
                <div class="panel online-container">
                    <div :class="'online-status ' + (player.online ? 'online' : 'offline')">{{ player.online ? "Online" : "Offline" }}</div>
                    <div class="online-last" v-if="!player.online">Last online <span class="online-highlight">{{ getTimeAgo(player.lastOnline) }}</span></div>
                    <div class="online-last" v-else>Session: <span class="online-highlight">{{ getSession(player.session) }}</span></div>
                </div>
            </div>
            <!-- <div class="mid">
            </div> -->
            <div class="bot playtime panel">
                <h1 class="panel-title">
                    Playtime (this week)
                </h1>
                <div class="playtime-graph">
                    <Line :data="getPlaytimeData()" :options="playtimeOptions" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    position: fixed;
    top: 0;
    left: 0;

    height: 100vh;
    width: 100vw;

    background-color: rgba(black, 0.5);

    z-index: 2;
}

.container {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    height: 44rem;
    width: 70rem;

    padding: 1.25rem;

    border-radius: 5px;

    background-color: $dark1;
}

// ==========
// ROWS
// ==========

.top,
.mid,
.bot {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    width: 100%;

    margin-top: 1.25rem;
}

.top {
    height: 4.5rem;

    margin-top: 0;
}

.panel {
    background-color: $panel;

    border-radius: 5px;
}

.panel-title {
    margin: 1rem 0 0 1rem;

    font-size: 1rem;
    font-weight: 400;
}

// ==========
// TOP
// ==========

.username-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    height: 100%;
    width: 50%;

    padding: 0 1rem;
}

.username-img {
    height: 2.5rem;
    width: 2.5rem;

    margin-right: 1.5rem;

    border-radius: 5px;
}

.username-username {
    font-size: 2.25rem;
    font-weight: 700;
    color: white;
}

.username-country {
    margin-left: auto;

    font-size: 1.75rem;
    font-weight: 400;
    color: $gray1;
}

// ==========

.online-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: fit-content;

    margin-left: auto;
    padding: 0.5rem 1.25rem;
}

.online-status {
    margin-bottom: 0.1rem;

    font-size: 1.75rem;
    font-weight: 700;
}

.online {
    color: $green;
}

.offline {
    color: $red;
}

.online-last {
    font-size: 1rem;
    font-weight: 400;
    color: $gray1;
}

.online-highlight {
    color: white;
}

// ==========
// BOT
// ==========

.playtime {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    height: 25%;
    width: 100%;
}

.playtime-graph {
    position: relative;

    height: 87%;
    width: 100%;

    padding: 1rem 1rem;
}
</style>

<script setup>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const user = useState('user')
const player = useState('playerCard')
const activeServer = useState('activeServer')
const innerClick = ref()

function clickInner() {
    innerClick.value = Date.now()
}
function clickOuter() {
    if (!innerClick.value || Math.abs(Date.now() - innerClick.value) > 100) {
        player.value = undefined
    }
}

function getTimeAgo(time) {
    var timeAgo = (Date.now() - time) / 1000
    return formatTime(timeAgo) + " ago"
}

function getSession(time) {
    return formatTime(time)
}

function formatTime(seconds) {
    var lead = 0
    var unit = ""
    if (seconds >= 86400) {
        lead = seconds / 86400
        unit = "days"
    } else if (seconds >= 3600) {
        lead = seconds / 3600
        unit = "hours"
    } else if (seconds >= 60) {
        lead = seconds / 60
        unit = "min"
    } else {
        lead = seconds
        unit = "sec"
    }

    return lead.toPrecision(2) + " " + unit
}

// ==========
// PLAYTIME
// ==========
function getLabels(value) {
    var values = []
    switch (value) {
        case "day":
            for (var i = 0; i < 24; i++) {
                values.push(i)
            }
            return values
        case "month":
            for (var i = 1; i <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); i++) {
                values.push(i)
            }
            return values
        case "year":
            values = ['Jan', 'Feb', 'Mar', 'Apr', 'Mar', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }

    return values
}

function getPlayerDataset() {
    const values = []

    // Timezone offset
    // for (var i = 0; i < -Math.floor(new Date().getTimezoneOffset() / 60); i++) {
    //     values.push(undefined)
    // }


    for (var timeFrame of activeServer.value.stats.graphs.month) {
        if (timeFrame.playerPlaytime) {
            const datasetPlayer = timeFrame.playerPlaytime.find(i => i.uuid == player.value.uuid)
            var value = datasetPlayer ? datasetPlayer.playtime : 0 / timeFrame.dataCount
            values.push(isNaN(value) || value == Infinity ? 0 : value * user.value.plan.updateFrequency / 3600)
        } else {
            values.push(0)
        }
    }

    return values
}

let playtimeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        x: {
            grid: {
                display: false,
            }
        },
        y: {
            grid: {
                display: false,
            },
            ticks: {
                callback: (value, index, ticks) => value + "h"
            },
            min: 0
        }
    }
}

function getPlaytimeData() {
    return {
        labels: getLabels("month"),
        datasets: [
            {
                label: 'Playtime',
                backgroundColor: '#00C2FF',
                borderColor: "#00C2FF",
                data: getPlayerDataset(),
                fill: {
                    target: 'origin',
                    above: '#00C2FF44',
                },
                lineTension: 0.1
            },
        ]
    }
}
</script>