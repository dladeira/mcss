<template>
    <div class="panel">
        <h1 class="panel-title">
            New Players (past 24h)
        </h1>

        <div class="list">
            <div class="player">
                <p class="player-time">7:13 PM</p>
                <p class="player-name">DespacitoMaster</p>
                <p class="player-action">left</p>
            </div>
            <div class="player">
                <p class="player-time">7:12 PM</p>
                <p class="player-name">DaddyBlockbone</p>
                <p class="player-action">joined</p>
            </div>
            <div class="player">
                <p class="player-time">6:02 PM</p>
                <p class="player-name">Maximimand</p>
                <p class="player-action">left</p>
            </div>
            <div class="player">
                <p class="player-time">6:02 PM</p>
                <p class="player-name">Maximimand</p>
                <p class="player-action">died</p>
            </div>
            <div class="player">
                <p class="player-time">6:01 PM</p>
                <p class="player-name">Maximimand</p>
                <p class="player-action">joined</p>
            </div>
            <div class="player">
                <p class="player-time">6:01 PM</p>
                <p class="player-name">Maximimand</p>
                <p class="player-action">left</p>
            </div>
            <div class="player">
                <p class="player-time">6:01 PM</p>
                <p class="player-name">Maximimand</p>
                <p class="player-action">joined</p>
            </div>
            <div class="player">
                <p class="player-time">5:58 PM</p>
                <p class="player-name">DespacitoMaster</p>
                <p class="player-action">joined</p>
            </div>
            <div class="player">
                <p class="player-time">5:34 PM</p>
                <p class="player-name">Wolfie</p>
                <p class="player-action">died</p>
            </div>
            <div class="player">
                <p class="player-time">5:26 PM</p>
                <p class="player-name">Wolfie</p>
                <p class="player-action">died</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

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
    padding: 0.5rem 0;
    border-radius: 5px;

    background-color: rgba(black, 0.3);

    overflow-y: scroll;
}

.player {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    width: 100%;

    margin-bottom: 0.75rem;
}

.player-time {
    width: 3.75rem;

    margin: 0 0 0 0.75rem;

    font-size: 0.75rem;
    font-weight: 400;
    color: $gray1;
}

.player-name {
    margin: 0 0.25rem 0 0;

    font-size: 0.75rem;
    font-weight: 700;
}

.player-action {
    margin: 0;

    font-size: 0.75rem;
    font-weight: 200;
}
</style>

<script setup>
const activeServer = useState('activeServer')
</script>