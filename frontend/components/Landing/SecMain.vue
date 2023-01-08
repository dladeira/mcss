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

                <div class="buttons">
                    <nuxt-link class="cta" to="login">
                        Get Started
                    </nuxt-link>
                    <a class="demo" to="login" @click="setDemo">
                        Demo
                    </a>
                </div>
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
    position: relative;
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

    animation: fade-in 2s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.title {
    margin: 0;

    font-size: 3.5rem;;
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
    margin-top: 1rem;
    margin-bottom: 3rem;

    font-size: 1.5rem;
    font-weight: 400;
    color: $gray1;
}

.buttons {
    display: flex;
    flex-direction: row;
}

.cta {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    height: 3.25rem;
    width: 14rem;

    margin-right: 2rem;

    border-radius: 1000px;

    font-size: 1.25rem;
    font-weight: 500;
    text-decoration: none;
    background-color: rgba($green, 0.1);
    color: $green;
    
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25);
    overflow: hidden;
    z-index: 0;

    transition: all 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);

    &::after {
        $borderRadius: 0px;
        content: '';
        position: absolute;
        z-index: -1;
        left: $borderRadius;
        top: $borderRadius;
        width: calc(100% - ($borderRadius * 2));
        height: calc(100% - ($borderRadius * 2));
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 1000px;

        opacity: 0;
    }

    &:hover {
        cursor: pointer;

        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.588);

        &:after {
            opacity: 1;
        }
    }
}

.demo {
    @extend .cta;

    width: 9rem;

    background-color: rgba(white, 0.1);
    color: white;
}

@keyframes rotate {
    100% {
        transform: rotate(1turn);
    }
}

.image {
    position: absolute;
    left: 40vw;
    height: 33rem;
    width: 52.9rem;

    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25);

    background-image: linear-gradient(to right, rgba(0, 0, 0, 0) 70%, rgb(11, 4, 4)), url("/product-preview.png");
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
    margin-top: 23vh;
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
        opacity: 0;
    }

    100% {
        left: 40vw;
        opacity: 1;
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

<script setup>
const demo = useState('demo')
const user = useState('user')


function setDemo() {
    demo.value = true
    user.value = undefined
    navigateTo('/u/servers')
}
</script>