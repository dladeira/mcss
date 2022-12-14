<template>
    <section class="main">
        <h1 class="title">
            <span class="title-blue">Bundled </span>
            with the most popular
            <span class="title-green">features</span>
        </h1>

        <div class="features">
            <div class="feature feature-blue">
                <h2 class="feature-title">
                    <nuxt-img class="feature-icon" src="/icon-reliable.svg" />
                    Server Usage
                </h2>

                <p class="desc">
                    <span class="desc-blue">CPU </span>
                    and
                    <span class="desc-green">RAM </span>
                    usage
                </p>
                <p class="desc">
                    Server
                    <span class="desc-red">health </span>
                    report
                </p>
                <p class="desc">
                    Chunks and worlds loaded
                </p>
            </div>

            <div class="feature feature-green">
                <h2 class="feature-title">
                    <nuxt-img class="feature-icon" src="/icon-intelligent.svg" />
                    Chat
                </h2>

                <p class="desc">
                    <span class="desc-blue">CPU </span>
                    and
                    <span class="desc-green">RAM </span>
                    usage
                </p>
                <p class="desc">
                    Server
                    <span class="desc-red">health </span>
                    report
                </p>
                <p class="desc">
                    Chunks and worlds loaded
                </p>
            </div>

            <div class="feature feature-red">
                <h2 class="feature-title">
                    <nuxt-img class="feature-icon" src="/icon-observant.svg" />
                    Players
                </h2>

                <p class="desc">
                    <span class="desc-blue">CPU </span>
                    and
                    <span class="desc-green">RAM </span>
                    usage
                </p>
                <p class="desc">
                    Server
                    <span class="desc-red">health </span>
                    report
                </p>
                <p class="desc">
                    Chunks and worlds loaded
                </p>
            </div>
        </div>
        <div class="panels">
            <div class="panel-main"/>
            <div class="panel-secondary" />
        </div>
    </section>
</template>

<style lang="scss" scoped>
.main {
    height: 100vh;
    min-height: 900px;

    padding-top: 20px;
}

.title {
    margin: 3rem 0 5rem 0;

    font-size: 3rem;
    font-weight: 700;

    &-blue {
        color: $blue;
    }

    &-green {
        color: $green;
    }
}

.features {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    width: 100%;

    margin-bottom: 4rem;
}

.feature {
    padding: 0.5rem 4rem 1rem 1.5rem;

    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25);

    &-icon {
        height: 30px;
        width: 30px;

        margin-right: 1rem;

        filter: brightness(0%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(142deg) brightness(104%) contrast(104%);
    }

    &-title {
        display: flex;
        flex-direction: row;
        align-items: center;

        margin-bottom: 30px;

        font-size: 1.5rem;
        font-weight: 700;
    }

    &-blue {
        background-color: rgba($blue, 0.15);
    }

    &-red {
        background-color: rgba($red, 0.15);
    }

    &-green {
        background-color: rgba($green, 0.15);
    }
}

.desc {
    &-blue {
        font-weight: bold;
        color: $blue;
    }

    &-green {
        font-weight: bold;
        color: $green;
    }

    &-red {
        font-weight: bold;
        color: $red;
    }
}

.panels {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.panel-main {
    height: 22rem;
    width: 65%;

    // background-color: rgba(white, 0.2);
    background-image: url("/feature-1.png");
    background-size: cover;
}

.panel-secondary {
    height: 22rem;
    width: 30%;

    background-image: url("/feature-2.png");
    background-size: cover;
}
</style>