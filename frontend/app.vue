<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<style>
.slide-left-enter-active,
.slide-left-exit-active,
.slide-right-enter-active,
.slide-right-exit-active {
    transition: all 200ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.slide-left-enter-from {
    transform: translate(100%, 0);
    /* filter: blur(0.25rem); */
}

.slide-right-enter-from {
    transform: translate(-100%, 0);
    /* filter: blur(0.25rem); */
}

.blur-enter-active,
.blur-leave-active {
    transition: all 200ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.blur-enter-from {
    opacity: 0;
    transform: translateY(25%);
}

.blur-leave-to {
    position: absolute;
    width: 100%;
    opacity: 0;
}
</style>

<script setup>
useHead({
    titleTemplate: 'MCSS - %s',
})
</script>