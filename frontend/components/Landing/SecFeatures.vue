<template>
    <section class="main">
        <h1 class="title">Features</h1>
        <h2 class="subtitle">Everything you need in one place</h2>

        <LandingFeature image="features/feature-1.svg" align="left"  title="Individual Player Stats" subtitle="Get to know each player individually and how they're doing on your server" />
        <LandingFeature image="features/feature-2.svg" align="right" title="Custom Data Viewer" subtitle="Select the statistics that are most important to you and view them on a variety of time periods" />
        <LandingFeature image="features/feature-3.svg" align="left"  title="Realtime Server Status" subtitle="Players complaining about lag? Do you need a better CPU? Not enough RAM?" />
        <LandingFeature image="features/feature-4.svg" align="right" title="Player Engagement Score" subtitle="Know how engaged your players are with your server, how long, and how often they play" />
        <LandingFeature image="features/feature-5.svg" align="left"  title="New & Returning Players" subtitle="Find out how many players joined your server today and how many new players you got" />
        <LandingFeature image="features/feature-6.svg" align="right" title="Full Player List" subtitle="Know your most active players, when they are online, where they are, and what they do" />
    </section>
</template>

<style lang="scss" scoped>
.main {
    height: fit-content;

    margin-top: 6rem;
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
</style>