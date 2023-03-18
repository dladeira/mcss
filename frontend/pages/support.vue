<template>
    <div>

        <Head>
            <Title>Support</Title>
        </Head>
        <h1 class="title"><span class="title-green">Support</span></h1>

        <div class="panels">
            <div class="panel">
                <div class="text">
                    For problems, suggestions, or inquiries, contact us at the following email address:
                </div>
                <div class="email">
                    mcss@ladeira.eu
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.title {
    margin: 116px auto 60px;

    width: fit-content;

    font-size: 3rem;

    &-green {
        color: #00FF75;
    }
}

.panels {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    width: fit-content;

    margin: 0 auto;
}

.panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    padding: 1rem;

    border: 1px rgba(white, 0.1) solid;
    border-radius: 10px;

    background-color: rgba(black, 0.15);
}
.text {
    width: 100%;

    padding: 1rem;

    font-family: 'Inter';
    font-size: 0.75rem;
}

.email {
    margin: 1rem 0;
    padding: 0.5rem 1rem;

    font-size: 1.25rem;
    font-weight: 700;
}
</style>

<script setup>
definePageMeta({
    pageTransition: {
        name: 'slide-left'
    },
    layout: 'landing'
})
</script>