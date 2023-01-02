<template>
    <NuxtLayout name="user">
        <slot v-if="activeServer" />
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.empty {
    color: white;
}
</style>

<script setup>
const activeServer = useState('activeServer')

onBeforeMount(() => {
    if (!activeServer.value)
        navigateTo("/u/servers")
})
</script>