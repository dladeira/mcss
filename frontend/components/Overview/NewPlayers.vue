<template>
    <div class="panel">
        <h1 class="panel-title">
            New Players (past 24h)
        </h1>

        <div class="list">
            <div v-for="player of getNewPlayers()" class="player">
                <img class="player-img" src="https://cravatar.eu/avatar/Maximimand/20.png" />
                <p class="player-name">{{player.username}}</p>
                <p class="player-time">{{ new Date(player.joined).getHours() }}:{{ new Date(player.joined).getMinutes }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    grid-column: 2 / 3;
    grid-row: 2 / 3;
    border-radius: 5px;

    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.25);
}

.panel-title {
    margin: 1rem 0 0 1rem;

    font-size: 1rem;
    font-weight: 400;
}

.list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    $margin: 0.5rem;
    height: 100%;
    width: calc(100% - ($margin * 2));

    margin: 1rem $margin $margin $margin;
    border-radius: 5px;

    background-color: rgba(black, 0.3);

    overflow-y: scroll;
}

.player {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;

    width: 100%;

    padding: 0.5rem 1rem;
}

.player-img {
    height: 20px;
    width: 20px;

    margin-right: 1rem;

    border-radius: 5px;
}

.player-name {
    margin: 0 1rem 0 0;
}

.player-time {
    margin: 0 1rem 0 auto;

    font-size: 0.75rem;
    font-weight: 400;
    color: $gray1;
}
</style>

<script setup>
const activeServer = useState('activeServer')

function getNewPlayers() {
    const { players } = activeServer.value.stats
    const list = []
    const now = Date.now()

    for (var player of players) {
        console.log(player.username + " joined " + (Math.round((now - player.joined) / 1000 / 60 / 60 * 10) / 10) + " hours ago")

        if (now - player.joined < 24 * 60 * 60 * 1000)
            list.push(player)
    }

    return list
}
</script>