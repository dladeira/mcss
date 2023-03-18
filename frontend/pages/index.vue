<template>
    <NuxtLayout name="no-user">            <Head>
                <Title>All-in-one minecraft server statistics plugin</Title>
            </Head>

            <LandingSecMain />
            <LandingSecFeatures />
            <LandingSecFAQ />
            <LandingSecCTA />
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.fake {
    color: white;
}
</style>

<script setup>
definePageMeta({
    pageTransition: {
        name: 'slide-right'
    },
    layout: 'landing'
})
</script>