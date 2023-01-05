<template>
    <div class="container">
        <div class="header">
            <h1 class="title">
                Data Lifetime
            </h1>
        </div>

        <div class="lifetime">
            <div @click="setLifetime(3)" :class="activeServer.dataLifetime == 3 ? 'option-selected' : user.plan.maxDataLife >= 3 ? 'option' : 'option-blocked'">
                <h1 class="time">
                    3 months
                </h1>
                <p class="size">
                    {{ activeServer.stats.cache.dataAge.months3 }}MB
                </p>
            </div>
            <div @click="setLifetime(6)" :class="activeServer.dataLifetime == 6 ? 'option-selected' : user.plan.maxDataLife >= 6 ? 'option' : 'option-blocked'">
                <h1 class="time">
                    6 months
                </h1>
                <p class="size">
                    {{ activeServer.stats.cache.dataAge.months6 }}MB
                </p>
            </div>
            <div @click="setLifetime(12)" :class="activeServer.dataLifetime == 12 ? 'option-selected' : user.plan.maxDataLife >= 12 ? 'option' : 'option-blocked'">
                <h1 class="time">
                    1 year
                </h1>
                <p class="size">
                    {{ activeServer.stats.cache.dataAge.months12 }}MB
                </p>
            </div>
            <div @click="setLifetime(0)" :class="activeServer.dataLifetime == 0 ? 'option-selected' : user.plan.maxDataLife > 12 ? 'option' : 'option-blocked'">
                <h1 class="time">
                    Forever
                </h1>
                <p class="size">
                    {{ activeServer.stats.cache.dataAge.forever }}MB
                </p>
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

    height: calc(20% - ($gap / 2));
    width: 100%;

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

.lifetime {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 90%;

    margin: auto;
}

.option {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: calc(25% - 0.20rem);

    padding: 16px 0;

    background-color: rgba(black, 0.20);

    &:first-child {
        border-radius: 10px 0 0 10px;
    }

    &:last-child {
        border-radius: 0 10px 10px 0;
    }

    &:hover {
        background-color: rgba(black, 0.30);

        cursor: pointer;
    }

    &-selected {
        @extend .option;

        background-color: rgba($blue, 0.2);

        &:hover {
            background-color: rgba($blue, 0.2);

            cursor: default;
        }
    }

    &-blocked {
        @extend .option;

        &:hover {
            background-color: rgba(black, 0.20);

            cursor: not-allowed;
            user-select: none;
        }
    }
}

.time {
    margin: 0 0 6px;

    font-size: 0.85rem;
    font-weight: 700;
    color: white;
}

.size {
    margin: 0;

    font-size: 0.75rem;
    font-weight: 400;
    color: $gray2;
}
</style>

<script setup>
const user = useState('user')
const activeServer = useState('activeServer')
const config = useRuntimeConfig()

async function setLifetime(time) {
    if (user.value.plan.maxDataLife >= (time == 0 ? 24 : time) && time != activeServer.value.dataLifetime) {
        if (confirm('Are you sure you want to change data lifetime? This leads to data loss')) {
            const { data, error } = await useFetch(config.public.origin + '/api/servers/lifetime', {
                method: 'POST',
                body: {
                    _id: activeServer.value._id,
                    lifetime: time
                }
            })

            if (error.value)
                return console.log(error.value)

            activeServer.value.dataLifetime = time
        }
    }
}
</script>