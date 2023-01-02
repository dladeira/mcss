<template>
    <section class="main">
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
            <div class="image" />
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
    min-height: 900px;
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

    animation: fade-in 2s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.subtitle {
    margin: 0;
    margin-bottom: 3rem;

    font-size: 2rem;
    font-weight: 400;
    color: $gray1;

    animation: fade-in 2s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.cta {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;


    height: 5rem;
    width: 20rem;

    border-radius: 1000px;

    font-size: 2rem;
    font-weight: 500;
    text-decoration: none;
    background-color: rgba($green, 0.1);
    color: $green;
    
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25);
    overflow: hidden;
    z-index: 0;

    &::after {
        content: '';
        position: absolute;
        z-index: -1;
        left: 6px;
        top: 6px;
        width: calc(100% - 12px);
        height: calc(100% - 12px);
        background: #113a3d;
        border-radius: 1000px;

        opacity: 0;
    }

    &:hover {
        &:after {
            opacity: 1;
        }
    }
}

@keyframes rotate {
    100% {
        transform: rotate(1turn);
    }
}

.image {
    position: absolute;
    left: 60vw;
    height: 33rem;
    width: 52.9rem;

    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25);

    background-image: linear-gradient(to right, rgba(0, 0, 0, 0) 60%, rgb(11, 4, 4)), url("/product-preview.png");
    background-size: contain;

    animation: slide-from-right 1s cubic-bezier(0.22, 0.61, 0.36, 1);
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

@keyframes slide-from-right {
    0% {
        left: 100vw;
    }

    100% {
        left: 60vw;
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

@keyframes grow-height {
    0% {
        height: 0px;
    }

    100% {
        height: 5rem;
    }
}
</style>