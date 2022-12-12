<template>
    <NuxtLayout name="landing">
        <div class="page">
            <LandingSecMain />
            <LandingSecFeatures />
            <LandingSecPricing />
            <LandingSecRoadmap />
        </div>
        <Footer />
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.page {
    width: 1200px;
    max-width: 70%;

    margin: 0 auto;
}
</style>