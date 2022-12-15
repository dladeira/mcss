<template>
    <NuxtLayout name="landing">
        <LandingSecMain />
        <LandingSecFeatures />
        <LandingSecPricing />
        <LandingSecRoadmap />
    </NuxtLayout>
</template>

<style lang="scss">
.fake {
    color: white;
}
</style>

<script setup>
const token = useCookie("token", {
    maxAge: 2592000,
    sameSite: 'lax'
})

if (token && token.value.length > 0) {
    navigateTo("/user")
}
</script>