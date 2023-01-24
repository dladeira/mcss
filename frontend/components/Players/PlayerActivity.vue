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
                27.8
            </h1>
            <h3 class="front-label">
                Engagement Score
            </h3>
            <div class="front-change">
                <span class="front-negative">-0.3</span> vs last 24h
            </div>
            <div class="front-change">
                <span class="front-positive">+3.9</span> vs last week
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

.front-positive {
    font-weight: 700;
    color: $green;
}

.front-negative {
    font-weight: 700;
    color: $red;
}
</style>

<script setup>
const activeServer = useState('activeServer')
</script>