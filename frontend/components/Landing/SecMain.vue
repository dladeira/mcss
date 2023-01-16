<template>
    <section class="main">
        <div class="text">

            <h1 class="title">
                The <span class="title-blue">all-in-one</span> <span class="title-green">Minecraft</span> server<br />
                statistics <span class="title-blue">plugin</span> for <span class="title-red">admins</span>
            </h1>

            <h2 class="subtitle">
                Never worry again about installing all the different plugins to track server statistics.<br />
                From CPU & RAM usage, to player chatting patterns, we've got it all.
            </h2>

            <div class="buttons">
                <nuxt-link class="cta" to="login">
                    Get Started
                </nuxt-link>
                <div class="demo" @click="setDemo">
                    See demo
                </div>
            </div>
        </div>
        <div class="images">
            <div class="image sec-main-panel image-left" />
            <div class="image sec-main-panel image-right" />
            <div class="image sec-main-panel image-center" />
        </div>
    </section>
</template>

<style lang="scss" scoped>
.main {
    height: 100vh;
    min-height: 900px;
}

.text {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top: 6rem;

    animation: fade-in 2s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.title {
    margin: 0;

    font-size: 3.5rem;
    font-weight: 700;
    text-align: center;

    &-blue {
        color: $blue;
    }

    &-green {
        color: $green;
    }

    &-red {
        color: $red;
    }
}

.subtitle {
    margin: 1rem 0 2rem;

    font-size: 1.25rem;
    font-weight: 400;
    line-height: 2rem;
    text-align: center;
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

    height: 3.5rem;
    width: 16rem;

    margin-right: 2rem;

    border-radius: 1000px;

    font-size: 1.25rem;
    font-weight: 500;
    text-decoration: none;
    background-color: rgba($green, 0.5);
    color: white;

    box-shadow: 0 0 10px 0 rgba($green, 0.5);
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

        box-shadow: 0 0 20px 0 rgba($green, 0.588);

        &:after {
            opacity: 1;
        }
    }
}

.demo {
    @extend .cta;

    width: 12rem;

    background-color: rgba(white, 0.1);
    color: white;
    box-shadow: none;

    &:hover {
        box-shadow: none;
    }
}

@keyframes rotate {
    100% {
        transform: rotate(1turn);
    }
}

.images {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    margin-top: 5rem;
}

$panelHeight: 62rem;
$panelWidth: 120rem;
$panelScale: 0.24;
$panelCenterScale: 1.2;
$panelOffset: 4rem;

.image {
    height: calc($panelHeight * $panelScale);
    width: calc($panelWidth * $panelScale);

    border-radius: 10px;

    background-color: rgba(white, 0.2);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;

    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.466);

    transition: opacity 2s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.image-left {
    position: absolute;
    left: -$panelOffset;

    background-image: url("/feature2.png");
}

.image-right {
    position: absolute;
    right: -$panelOffset;

    background-image: url("/feature3.png");
}

.image-center {
    background-image: url("/feature1.png");

    height: calc($panelHeight * $panelScale * $panelCenterScale);
    width: calc($panelWidth * $panelScale * $panelCenterScale);

    z-index: 2;
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