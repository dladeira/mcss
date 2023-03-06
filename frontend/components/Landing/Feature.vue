<template>
    <div :class="'container-' + align">
        <div class="text">
            <h1 :class="'title ' + align">{{ title }}</h1>
            <h2 :class="'subtitle ' + align">{{ subtitle }}</h2>
        </div>
        <nuxt-img class="image" :src="image" />
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 9rem;

    &-left {
        @extend .container;
        flex-direction: row;
    }

    &-right {
        @extend .container;
        flex-direction: row-reverse;
    }
}

.text {
    width: 50%;
}

.title {
    margin: 0 0 1rem;

    font-size: 2.25rem;
    font-weight: 700;
    text-align: right;
}

.subtitle {
    margin: 0;

    font-size: 1.25rem;
    font-weight: 400;
    color: $gray1;
}

.left {
    text-align: left;
}

.right {
    text-align: right;
}

.image {
    max-width: 45%;
}
</style>

<script setup>
const props = defineProps({
    title: String,
    subtitle: String,
    image: String,
    align: String
})
</script>