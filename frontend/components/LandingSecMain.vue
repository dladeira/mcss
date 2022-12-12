<template>
    <section class="main">
        <LandingNavbar />

        <div class="jumbotron">
            <div class="text">

                <h1 class="title">
                    <span class="title-blue">All-in-one </span><br />
                    <span class="title-green">minecraft </span>
                    server<br />
                    statistics <span class="title-blue">plugin </span><br />
                </h1>

                <h2 class="subtitle">
                    Keep track of your server usage<br />
                    and player behaviors
                </h2>

                <nuxt-link class="cta" to="login">
                    Get Started
                </nuxt-link>

            </div>
            <nuxt-img class="image" src="/product-preview.png" />
        </div>
        <div class="icons">
            <div class="icon">
                <nuxt-img class="icon-image" src="/icon-intelligent.svg" />
                <div class="icon-text">
                    Intelligent
                </div>
            </div>
            <div class="icon">
                <nuxt-img class="icon-image" src="/icon-reliable.svg" />
                <div class="icon-text">
                    Reliable
                </div>
            </div>
            <div class="icon">
                <nuxt-img class="icon-image" src="/icon-observant.svg" />
                <div class="icon-text">
                    Observant
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.main {
    height: 100vh;

    padding-top: 20px;
}

.jumbotron {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    margin-top: 75px;
}

.text {
    display: flex;
    flex-direction: column;

    margin-top: 50px;
}

.title {
    margin: 0;
    margin-bottom: 2rem;

    font-size: 4rem;
    ;
    font-weight: 700;

    &-blue {
        color: $blue;
    }

    &-green {
        color: $green;
    }
}

.subtitle {
    margin: 0;
    margin-bottom: 5rem;

    font-size: 2rem;
    font-weight: 400;
    color: $gray1;
}

.cta {
    width: fit-content;

    padding: 16px 40px;

    font-size: 2rem;
    font-weight: 500;
    background-color: rgba($green, 0.1);
    color: $green;

    text-decoration: none;

    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25);
}

.image {
    position: absolute;
    left: 60vw;
    height: 33rem;

    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25);
}

.icons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: fit-content;

    margin: 0 auto;
    margin-top: 10vh;
}

.icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin: 0 3rem;

    &-image {
        height: 50px;
        width: 50px;
    }

    &-text {
        margin-top: 28px;

        font-size: 1rem;
        font-weight: 500;
        color: $gray2;
    }
}
</style>