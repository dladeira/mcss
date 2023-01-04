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
    /* filter: blur(0.5rem); */
}

.slide-right-enter-from {
    transform: translate(-100%, 0);
    /* filter: blur(0.5rem); */
}
</style>

<script setup>
useHead({
    titleTemplate: 'MCSS - %s',
})
</script>