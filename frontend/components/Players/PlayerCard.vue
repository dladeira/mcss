<template>
    <div class="wrapper" v-if="player" @click="clickOuter()">
        <div class="container" @click="clickInner()">
            <div class="top">
                <div class="username-container">
                    <img class="username-img" :src="`https://cravatar.eu/avatar/${player.username}/40.png`" />
                    <div class="username-username">{{ player.username }}</div>
                    <div class="username-country">{{ "Poland" }}</div>
                </div>
                <div class="online-container">
                    <div :class="'online-status ' + (player.online ? 'online' : 'offline')">{{ player.online ? "Online" : "Offline" }}</div>
                    <div class="online-last" v-if="!player.online">Last online <span class="online-highlight">{{ getTimeAgo(player.lastOnline) }}</span></div>
                    <div class="online-last" v-else>Session: <span class="online-highlight">{{ getSession(player.session) }}</span></div>
                </div>
            </div>
            <div class="mid">

            </div>
            <div class="bot">

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
}

.top {
    height: 4.5rem;
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

    background-color: $panel;

    border-radius: 5px;
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

    border-radius: 5px;


    background-color: $panel;
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
</style>

<script setup>
const player = useState('playerCard')
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
</script>