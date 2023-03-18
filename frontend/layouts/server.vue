<template>
    <div>
        <slot v-if="activeServer" />
    </div>
</template>

<style lang="scss" scoped>
.empty {
    color: white;
}
</style>

<script setup>
const notifications = useState('notifications')
const activeServer = useState('activeServer')

onBeforeMount(() => {
    if (!activeServer.value) {
        navigateTo("/u/servers")

        notifications.value.push({
            html: "Please create a server before accessing statistics",
            time: Date.now(),
            id: Math.random(),
            type: 'red'
        })
    }
})
</script>