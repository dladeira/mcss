<template>
    <section class="main" id="features">
        <h1 class="title">Features</h1>
        <h2 class="subtitle">Everything you need in one place</h2>

        <div class="feature">
            <div class="image-1" />
            <div class="text-right">
                <h1 class="text-title">Analyze <span class="tt-green">player behaviour</span> and <span class="tt-blue">activity</span></h1>
                <p class="text-desc">
                    Know when your server has the most players and when to have your staff online
                </p>
                <ul dir="rtl" class="text-list">
                    <li>View message and command frequency</li>
                    <li>Player message content</li>
                    <li>Most and least used commands</li>
                </ul>
            </div>
        </div>

        <div class="feature">
            <div class="text-left">
                <h1 class="text-title">Visualize <span class="tt-green">data</span> the way <span class="tt-blue">you</span> want to see it</h1>
                <p class="text-desc">
                    Select the statistics that are most important to you and view them on a variety of time periods
                </p>
                <ul class="text-list">
                    <li>4 default graphs</li>
                    <li>5 time periods</li>
                    <li>12+ statistics</li>
                    <li>Custom data viewer</li>
                </ul>
            </div>
            <div class="image-2" />
        </div>

        <div class="feature">
            <div class="image-3" />
            <div class="text-right">
                <h1 class="text-title">Measure server <span class="tt-green">performance</span> in <span class="tt-blue">realtime</span></h1>
                <p class="text-desc">
                    Do you need a better CPU? Not enoguh RAM? Are you getting DDoS'ed?
                </p>
                <ul dir="rtl" class="text-list">
                    <li>Realtime CPU and RAM load</li>
                    <li>Past server performance</li>
                    <li>Daily TPS average graph</li>
                </ul>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.main {
    height: 210vh;

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

.feature {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 10rem;
}

.image {
    height: 23vw;
    width: 23vw;

    border-radius: 1000px;

    background-color: white;
    background-position: center center;
    background-size: cover;

    box-shadow: 0 0 20px 0 rgba(black, 0.6);

    &-1 {
        @extend .image;

        background-image: url('/feature1.png');
    }
    &-2 {
        @extend .image;

        background-image: url('/feature2.png');
        background-size: 20rem;
    }
    &-3 {
        @extend .image;

        background-image: url('/feature3.png');
        background-size: 20rem;
    }
}

.text {
    width: 55%;

    &-left {
        @extend .text;

        text-align: left;
    }

    &-right {
        @extend .text;

        text-align: right;
    }
}

.text-title {
    margin: 0;

    font-size: 3rem;
    font-weight: 700;
    color: white;
}

.tt-green {
    color: $green;
}

.tt-blue {
    color: $blue;
}

.text-desc {
    font-size: 1.25rem;
    font-weight: 400;
    color: $gray1;
}

.text-list {
    @extend .text-desc;

    padding-right: 1rem;

    line-height: 2.5rem;
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