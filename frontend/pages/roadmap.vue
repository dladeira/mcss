<template>
    <div>

        <Head>
            <Title>Roadmap</Title>
        </Head>

        <h1 class="page-title">Our <span class="title-blue">roadmap</span> for the <span class="title-green">future</span></h1>

        <div class="milestones">
            <LandingMilestone v-for="milestone of milestones" :release="milestone.release" :title="milestone.title" :version="milestone.version" :description="milestone.description" :points="milestone.points" :color="milestone.color" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-title {
    margin: 5rem 0 0;

    font-size: 3rem;
    font-weight: 700;
    color: white;
}

.milestones {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    margin-top: 3rem;
}

.title-blue {
    color: $blue;
}

.title-green {
    color: $green;
}
</style>

<script setup>
const milestones = [
    {
        release: "February 1st",
        title: "Launch",
        version: "1.0",
        description: "The initial launch of the service with only it's key features",
        points: [
            "Control Panel v1.0", "Server Manager v1.0", "Support for 50 servers", "Free service"
        ],
        color: "white"
    },
    {
        release: "April 1st",
        title: "Admin Update",
        version: "1.1",
        description: "Support for large scale networks and servers and admin tools.",
        points: [
            "Server Manager v2.0", "BungeeCord support", "Multiple users"
        ],
        color: "green"
    },
    {
        release: "UNKOWN",
        title: "Data Update",
        version: "1.2",
        description: "Provide more practical information to server owners and suggest changes.",
        points: [
            "Control panel v2.0", "Server suggestions", "Surveys"
        ],
        color: "blue"
    },
    {
        release: "UNKOWN",
        title: "\'Perfect\" Update\"",
        version: "1.3",
        description: "Final product release to the public. Fix all bugs and optimize service.",
        points: [
            "Pricing & Plans", "Customer support", "Ads and branding", "Support 200 servers"
        ],
        color: "red"
    }
]

definePageMeta({
    pageTransition: {
        name: 'slide-right'
    },
    layout: 'landing'
})
</script>