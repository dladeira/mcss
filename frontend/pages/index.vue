<template>
    <NuxtLayout name="landing">
        <div class="page">
            <LandingSecMain />
            <LandingSecFeatures />
            <LandingSecPricing />
        </div>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.page {
    height: 100%;
    width: 1200px;
    max-width: 70%;

    margin: 0 auto;
}
</style>