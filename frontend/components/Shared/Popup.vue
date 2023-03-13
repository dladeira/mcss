<template>
    <div v-if="visible && finalVisible" :class="selfVisible ? 'outer-container' : 'outer-container-hidden'">
        <div class="inner-container">
            <div class="title">{{ title }}</div>
            <div class="description">{{ description }}</div>
            <div class="button" @click="close">{{ button }}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.outer-container {
    position: fixed;
    top: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    height: 100vh;
    width: 100vw;

    background-color: rgba(black, 0.6);

    animation: fade-in 0.5s ease-in-out forwards;
    transition: opacity 0.5s ease-in-out;

    &-hidden {
        @extend .outer-container;

        animation: fade-out 0.2s ease-in-out forwards;
    }
}

@keyframes fade-in {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes fade-out {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

.inner-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    padding: 2rem;

    border-radius: 10px;
    border: 1px solid rgba(white, 0.2);

    background-color: rgba(9, 19, 30, 0.97);
}

.title {
    margin-bottom: 1rem;

    font-size: 2.5rem;
    font-weight: 700;
}

.description {
    width: 25rem;

    font-size: 0.9rem;

    margin-bottom: 2rem;
}

.button {
    padding: 0.5rem 2rem;

    border-radius: 5px;

    background-color: darken($blue, 10);
    color: white;

    &:hover {
        cursor: pointer;
        background-color: darken($blue, 15);
    }
}
</style>

<script setup>
const props = defineProps({
    title: String,
    description: String,
    button: String,
    visible: Boolean
})
const selfVisible = ref(true)
const finalVisible = ref(true)

function close() {
    selfVisible.value = false

    setTimeout(() => {
        finalVisible.value = false
    }, 200)
}
</script>