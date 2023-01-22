<template>
    <section class="main">
        <h3 class="tag">What are you waiting for</h3>
        <h1 class="title">Get started in <span class="title-green">seconds</span></h1>
        <h2 class="subtitle">View your server from a whole new perspective</h2>
        
        <nuxt-link class="cta" to="/login">Register</nuxt-link>
    </section>
</template>

<style lang="scss" scoped>
.main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    height: 50vh;
}

.tag {
    margin: 0;

    font-size: 1.25rem;
    font-weight: 400;
    color: $blue;
}

.title {
    margin: 0 0 1rem;

    font-size: 3rem;
    font-weight: 700;

    &-green {
        color: $green;
    }
}

.subtitle {
    margin: 0 0 3.5rem;

    font-size: 1.25rem;
    font-weight: 400;
}

.cta {
    padding: 1rem 5rem;

    border-radius: 1000px;

    font-size: 1.5rem;
    font-weight: 500;
    text-decoration: none;
    background-color: rgba($green, 0.5);
    color: white;

    box-shadow: 0 0 20px 0 rgba(black, 0.25);

    &:hover {
        background-color: rgba($green, 0.4);
    }
}
</style>