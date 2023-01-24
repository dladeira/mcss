<template>
    <div class="panel">
        <h1 class="panel-title">
            Player List
        </h1>

        <input class="search" type="text" placeholder="Search..." />

        <div class="list">
            <div class="list-header">
                <div class="header header-username player-name">Username</div>
                <div class="header player-location">Location</div>
                <div class="header player-engagement">Engagement</div>
                <div class="header player-messages">Messages</div>
                <div class="header player-session">Session</div>
                <div class="header player-playtime">Playtime</div>
            </div>

            <div class="player" v-for="player of activeServer.stats.cache.players">
                <img class="player-img" :src="`https://cravatar.eu/avatar/${player.username}/20.png`" />
                <div class="player-name">{{ player.username }}</div>
                <div class="player-location">{{player.location}}</div>
                <div class="player-engagement">58.3</div>
                <div class="player-messages">{{player.messages}}</div>
                <div class="player-session">{{player.online ? formatTime(Math.random() * 10000) : "OFFLINE"}}</div>
                <div class="player-playtime">{{formatTime(player.playtime)}}</div>
                <div class="player-view">View</div>
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

.search {
    position: absolute;
    top: 10px;
    right: 0.6rem;
    
    width: 16rem;

    padding: 0.5rem 0.5rem;

    border: none;

    font-size: 1rem;
    text-align: left;
    background-color: rgba(black, 0.3);
    color: white;

    &::placeholder {
        font-style: italic;
        color: $gray1;
    }

    &:focus {
        outline: none;
    }
}

.list {
    $margin: 0.5rem;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    height: 100%;
    width: calc(100% - ($margin * 2));

    margin: 1.25rem $margin $margin $margin;
    border-radius: 5px;

    background-color: rgba(black, 0.3);

    overflow-y: scroll;
}

.list-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.header {
    margin: 1rem 0 1rem;

    font-size: 1rem;
    font-weight: 700;
    color: white;

    &-username {
        margin-left: 3.5rem !important;

        width: 11rem;
    }
}

.player {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    width: 100%;

    padding: 0.5rem 1rem;

    font-size: 1rem;
    font-weight: 400;
    color: $gray1;
}

.player-img {
    height: 1rem;
    width: 1rem;
}

.player-name {
    width: 12rem;

    margin-left: 1.5rem;
}

.player-location {
    width: 11rem;
}

.player-engagement {
    width: 9rem;
}

.player-messages {
    width: 7rem;
}

.player-session {
    width: 7rem;
}

.player-playtime {
    width: 7rem;
}

.player-view {
    margin: 0 1rem 0 auto;

    color: $blue;
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

    return lead.toPrecision(3) + unit
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
    } else if (seconds => 60) {
        lead = seconds / 60
        unit = "m"
    } else {
        lead = seconds
        unit = "s"
    }

    return lead.toPrecision(2) + unit
}
</script>