<template>
    <div class="container">
        <div class="header">
            <h1 class="title">
                Storage
            </h1>
        </div>

        <div class="body">
            <div class="battery">
                <div class="battery-body" />
                <div class="battery-cap" />
                <div class="battery-overlay" :style="{ width: (activeServer.stats.cache.storageUsed / activeServer.storage / 1.11111111 * 100) + '%' }" />
            </div>
            <div class="text">
                <h1 class="used">
                    {{ activeServer.stats.cache.storageUsed }}MB
                </h1>
                <h3 class="desc">
                    used out of
                </h3>
                <h2 class="total">
                    {{ activeServer.storage }}MB
                </h2>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    height: calc(30% - ($gap / 2));
    width: 100%;

    margin-bottom: $gap;

    background-color: $gray6;
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

.body {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;

    height: fit-content;
    width: 100%;

    margin: 1.5rem auto 0 auto;
}

.battery {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    width: 40%;

    &-body {
        height: 5rem;
        width: 90%;

        border-radius: 5px;

        background-color: rgba($red, 0.3);
    }

    &-cap {
        height: 2.5rem;
        width: 5%;

        border-radius: 0 5px 5px 0;

        background-color: rgba($red, 0.3);
    }

    &-overlay {
        position: absolute;

        height: 5rem;

        border-radius: 5px;

        background-color: $red;
    }
}

.text {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.used {
    margin: 0;

    font-size: 3rem;
    font-weight: 700;
    color: $red;
}

.desc {
    margin: 0.25rem 0;

    font-size: 1rem;
    font-weight: 700;
    color: rgba(white, 0.4);
}

.total {
    margin: 0;

    font-size: 1.5rem;
    font-weight: 700;
    color: white;
}
</style>

<script setup>
const activeServer = useState('activeServer')
</script>