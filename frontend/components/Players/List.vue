<template>
    <div class="container">
        <div class="header">
            <h2 class="title">
                Player List
            </h2>

            <input class="search" type="text" v-model="search" placeholder="Search...">
        </div>

        <div class="labels">
            <div class="label-username">
                Username
            </div>
            <div class="label-location">
                Location
            </div>
            <div class="label-messages">
                Messages
            </div>
            <div class="label-time">
                Playtime
            </div>
        </div>
        <div class="players">
            <div v-for="player of activeServer.stats.cache.players">
                <div :class="player.online ? 'player' : 'player-offline'" v-if="player.username.indexOf(search) != -1">
                    <img class="head" :src="`https://cravatar.eu/avatar/${player.username}/20.png`" />
                    <div class="username">{{ player.username }}</div>
                    <div class="location">{{ player.location }}</div>
                    <div class="messages">{{ player.messages }}</div>
                    <div class="time">{{ Math.round(player.playtime / 3600) }}h</div>
                    <div class="view">View</div>
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
    width: calc(50% - ($gap / 2));

    background-color: $gray6;

    padding-right: 0.5rem;
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

.search {
    width: 12rem;

    margin-top: 8px;
    padding: 5px 13px;

    border: none;

    font-size: 1rem;
    text-align: left;
    background-color: rgba(black, 0.3);
    color: white;

    &:focus {
        outline: none;
    }

    &:placeholder-shown {
        font-style: italic;
    }
}

.labels {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    width: 100%;

    padding: 1rem 0 0 50px;
}

.label {
    font-weight: 300;
    font-size: 1rem;
    color: $gray1;

    &-username {
        @extend .label;

        width: 27%;
    }

    &-location {
        @extend .label;

        width: 27%;
    }

    &-messages {
        @extend .label;

        width: 18%;
    }

    &-time {
        @extend .label;

        width: 20%;
    }
}

.players {
    height: 100%;
    width: 100%;

    margin: 1rem;
    padding-left: 1rem;

    overflow-y: scroll;
}

.player {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    width: 100%;

    margin-bottom: 1rem;

    &-offline {
        @extend .player;

        color: $gray2 !important;
    }
}

.head {
    margin-right: 14px;
}

.username {
    width: 26%;
}

.location {
    width: 26%;

    color: $green;
}

.messages {
    width: 17.5%;
}

.time {
    color: $green;
}

.view {
    margin: 0 1.5rem 0 auto;

    text-decoration: underline;
    color: #008bff;

    &:hover {
        cursor: pointer;
    }
}
</style>

<script setup>
const activeServer = useState('activeServer')

const search = useState('player-search', () => "")
</script>