<template>
    <div class="panel">
        <h1 class="panel-title">
            Population (past 24h)
        </h1>

        <div class="stats">
        <div class="front">
            <h1 class="front-title">
                533
            </h1>
            <h3 class="front-label">
                recurring players
            </h3>
            <div class="front-change">
                <span class="front-positive">+4</span> vs last 24h
            </div>
        </div>

        <div class="back">
            <h1 class="back-title">
                17
            </h1>
            <h3 class="back-label">
                new players
            </h3>
            <div class="back-change">
                <span class="back-positive">+2</span> vs last 24h
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

.front-positive {
    font-weight: 700;
    color: $green;
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

.back-positive {
    font-weight: 700;
    color: $green;
}
</style>

<script setup>
const activeServer = useState('activeServer')
</script>