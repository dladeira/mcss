<template>
    <div :class="'milestone ' + 'border-' + color">
        <div class="m-release">Expected release <span class="m-release-date">{{ release }}</span></div>
        <div :class="'m-title ' + color">{{ title }} <span class="m-version">{{ version }}</span></div>
        
        <div class="m-desc">
            <div class="m-text">{{ description }}</div>
            <div class="points">
                <div class="point" v-for="point of points">{{ point }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.milestone {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    margin: 1vw;

    height: 30vh;
    width: 45%;



    background-color: #1B273D;

    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25);

    &-green {
        border-top-color: rgba($green, 0.5);
    }

    &-blue {
        border-top-color: rgba($blue, 0.5)
    }

    &-red {
        border-top-color: rgba($red, 0.5);
    }
}

.border {
    &-white {
        border-top: 10px solid rgba(white, 0.5);
    }
    &-blue {
        border-top: 10px solid rgba($blue, 0.5);
    }
    &-green {
        border-top: 10px solid rgba($green, 0.5);
    }
    &-red {
        border-top: 10px solid rgba($red, 0.5);
    }
}

.m-release {
    margin-top: 1rem;

    font-size: 1rem;
    font-weight: 400;
    color: $gray1;

    &-date {
        color: white;
    }
}

.m-title {
    margin-top: 1rem;
    margin-bottom: 0.5em;

    font-size: 2rem;
    font-weight: 700;
    color: white;
}

m.version {
    color: $gray1;
}

.green {
    color: $green;
}

.blue {
    color: $blue;
}

.red {
    color: $red;
}

.m-desc {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    padding: 0 2rem;
    padding-bottom: 30px;
}

.m-text {
    width: calc(40% + 1rem);

    font-weight: 200;
    line-height: 2rem;
}

.point {
    min-height: 2rem;

    font-weight: 400;
    line-height: 2rem;
    text-align: right;

    &-bold {
        font-weight: 700;
    }
}
</style>

<script setup>
const props = defineProps({
    release: String,
    title: String,
    version: String,
    description: String,
    points: Array,
    color: String,
})
</script>