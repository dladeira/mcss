<template>
    <div class="landing-wrapper">
        <div class="landing-page">
            <LandingNavbar />
            <slot />
        </div>
        <Footer />
    </div>
</template>

<style lang="scss">
.landing-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;

    min-height: calc(100vh + 140px);
    width: 100%;


    overflow-x: hidden;
}

.landing-page {
    width: 1200px;
    max-width: 70%;

    margin: 0 auto;
}
</style>