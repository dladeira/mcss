<template>
    <div>

        <Head>
            <Title>Pricing</Title>
        </Head>

        <h1 class="page-title">Choose your <span class="title-green">plan</span></h1>

        <h1 class="title">For <span class="title-green">free</span>, for <span class="title-blue">now</span>...</h1>
        <h2 class="subtitle">For more information check out our <nuxt-link class="link" to="/roadmap">roadmap</nuxt-link></h2>
    </div>
</template>

<style lang="scss" scoped>
.page-title {
    margin: 5rem 0 0;

    font-size: 3rem;
    font-weight: 700;
    color: white;
}

.title {
    width: fit-content;

    margin: 9rem auto 1rem auto;

    font-size: 3rem;
    font-weight: 700;
    color: white;
}

.subtitle {
    width: fit-content;
    margin: 0 auto;

    font-size: 2rem;
    font-weight: 400;
    color: white;
}

.link {
    font-weight: 700;
    text-decoration: underline;
    color: $green;
}

// =====

.title-blue {
    color: $blue;
}

.title-green {
    color: $green;
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