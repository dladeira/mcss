<template>
    <section class="main">
        <h1 class="title">Features</h1>
        <h2 class="subtitle">Everything you need in one place</h2>

        <LandingFeature image="features/feature-1.svg" align="left"  title="Individual Player Stats" subtitle="Get to know each player individually and how they're doing on your server" />
        <LandingFeature image="features/feature-2.svg" align="right" title="Custom Data Viewer" subtitle="Select the statistics that are most important to you and view them on a variety of time periods" />
        <LandingFeature image="features/feature-3.svg" align="left"  title="Realtime Server Status" subtitle="Players complaining about lag? Do you need a better CPU? Not enough RAM?" />
        <LandingFeature image="features/feature-4.svg" align="right" title="Player Engagement Score" subtitle="Know how engaged your players are with your server, how long, and how often they play" />
        <LandingFeature image="features/feature-5.svg" align="left"  title="New & Returning Player" subtitle="Find out how many players joined your server today and how many new players you got" />
        <LandingFeature image="features/feature-6.svg" align="right" title="Full Player List" subtitle="Know your most active players, when they are online, where they are, and what they do" />
    </section>
</template>

<style lang="scss" scoped>
.main {
    height: 360vh;

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

    margin: 1rem auto 10rem;

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