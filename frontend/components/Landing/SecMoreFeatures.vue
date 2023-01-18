<template>
    <section class="main" id="features">
        <h1 class="title">More features</h1>
        <h2 class="subtitle">Because all-in-one means A LOT of features</h2>

        <div class="features">
            <div class="feature">
                <nuxt-img class="feature-image" src="feature-extra-1.png" />
                <h1 class="feature-title">
                    Custom data viewer
                </h1>
                <p class="feature-desc">
                    Select the statistics that are most important to you and view them on a variety of time periods
                </p>
            </div>
            <div class="feature">
                <nuxt-img class="feature-image" src="feature-extra-2.png" />
                <h1 class="feature-title">
                    Chat usage over time
                </h1>
                <p class="feature-desc">
                    Select the statistics that are most important to you and view them on a variety of time periods
                </p>
            </div>
            <div class="feature">
                <nuxt-img class="feature-image" src="feature-extra-3.png" />
                <h1 class="feature-title">
                    Player activity graph
                </h1>
                <p class="feature-desc">
                    Select the statistics that are most important to you and view them on a variety of time periods
                </p>
            </div>
            <div class="feature">
                <nuxt-img class="feature-image" src="feature-extra-4.png" />
                <h1 class="feature-title">
                    Live player activity
                </h1>
                <p class="feature-desc">
                    Select the statistics that are most important to you and view them on a variety of time periods
                </p>
            </div>
            <div class="feature">
                <nuxt-img class="feature-image" src="feature-extra-5.png" />
                <h1 class="feature-title">
                    Live chat
                </h1>
                <p class="feature-desc">
                    Select the statistics that are most important to you and view them on a variety of time periods
                </p>
            </div>
            <div class="feature">
                <nuxt-img class="feature-image" src="feature-extra-6.png" />
                <h1 class="feature-title">
                    Chat statistics
                </h1>
                <p class="feature-desc">
                    Select the statistics that are most important to you and view them on a variety of time periods
                </p>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.main {
    height: 120vh;

    margin-top: 3rem;
    padding-top: 2rem;
}

.title {
    width: fit-content;


    margin: 0 auto;

    font-size: 3rem;
    font-weight: 700;
}

.subtitle {
    width: fit-content;

    margin: 1rem auto 5rem;

    font-size: 1.25rem;
    font-weight: 400;
    color: $gray1;
}

.features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    grid-gap: 1.5rem;
}

.feature {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    padding: 1.25rem;

    background-color: rgba(black, 0.2);

    &-image {
        height: 17vh;
        max-width: 100%;

        margin-bottom: 0.5rem;

        box-shadow: 0 0 20px 0 rgba(black, 0.25);
    }

    &-title {
        margin: 1rem 0 0;

        font-size: 1.5rem;
        font-weight: 700;
        color: white;
    }

    &-desc {
        width: 100%;

        margin: 0.5rem 0 0;

        font-size: 1rem;
        font-weight: 400;
        text-align: center;
        color: $gray1;
    }
}

@keyframes fade-in {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>