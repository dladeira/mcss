<template>
    <section class="main" id="features">
        <h1 class="title">
            <span class="title-blue">Bundled </span>
            with the most popular
            <span class="title-green">features</span>
        </h1>

        <div class="features">
            <div class="sec-features-feature feature feature-blue">
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

            <div class="sec-features-feature feature feature-green">
                <h2 class="feature-title">
                    <nuxt-img class="feature-icon" src="/icon-intelligent.svg" />
                    Chat
                </h2>

                <p class="desc">
                    <span class="desc-blue">Player </span>
                    Chatting Patterns
                </p>
                <p class="desc">
                    Command frequency
                </p>
                <p class="desc">
                    Realtime
                    <span class="desc-green">chat </span>
                    access
                </p>
            </div>

            <div class="sec-features-feature feature feature-red">
                <h2 class="feature-title">
                    <nuxt-img class="feature-icon" src="/icon-observant.svg" />
                    Players
                </h2>

                <p class="desc">
                    <span class="desc-blue">Player </span>
                    session information
                </p>
                <p class="desc">
                    Individual statistics
                </p>
                <p class="desc">
                    Peak
                    <span class="desc-blue">player </span>
                    count
                </p>
            </div>
        </div>
        <div class="panels">
            <div class="panel sec-features-panel panel-left" />
            <div class="panel sec-features-panel panel-right" />
            <div class="panel sec-features-panel panel-center" />
        </div>
    </section>
</template>

<style lang="scss" scoped>
.main {
    height: 110vh;

    margin-top: 3rem;
    padding-top: 2rem;
}

.title {
    margin: 0;
    margin-bottom: 5rem;

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

    margin-bottom: 6rem;
}

.feature {
    padding: 0.5rem 4rem 1rem 1.5rem;

    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25);

    opacity: 0;
    transition: opacity 2s cubic-bezier(0.22, 0.61, 0.36, 1);

    &-animated {
        opacity: 1;
    }

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
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

$panelHeight: 62rem;
$panelWidth: 120rem;
$panelScale: 0.25;
$panelCenterScale: 1.2;
$panelOffset: 4rem;

.panel {
    height: calc($panelHeight * $panelScale);
    width: calc($panelWidth * $panelScale);

    border-radius: 10px;

    background-color: rgba(white, 0.2);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;

    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.466);

    transition: opacity 2s cubic-bezier(0.22, 0.61, 0.36, 1);
    opacity: 0;

    &-animated {
        opacity: 1;
    }
}

.panel-left {
    position: absolute;
    left: -$panelOffset;

    background-image: url("/feature2.png");
}

.panel-right {
    position: absolute;
    right: -$panelOffset;

    background-image: url("/feature3.png");
}

.panel-center {
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
onMounted(() => {
    document.addEventListener('scroll', function () {
        if (isInViewport(document.getElementsByClassName("sec-features-panel")[0])) {
            for (var panel of document.getElementsByClassName("sec-features-panel"))
                if (!panel.classList.contains("panel-animated"))
                    panel.classList.add("panel-animated")
        }

        if (isInViewport(document.getElementsByClassName("sec-features-feature")[0])) {
            for (var panel of document.getElementsByClassName("sec-features-feature"))
                if (!panel.classList.contains("feature-animated"))
                    panel.classList.add("feature-animated")
        }
    }, {
        passive: true
    })
})

/* source: https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/#:~:text=Use%20the%20getBoundingClientRect()%20method%20to%20get%20the%20size%20of,in%20the%20viewport%20or%20not. */
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)

    );
}
</script>