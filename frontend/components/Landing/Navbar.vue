<template>
    <nav class="nav">

        <nuxt-link to="/" class="brand">
            MCSS
        </nuxt-link>

        <div class="links">
            <nuxt-link to="/pricing" :class="route.path == '/pricing' ? 'link-active' : 'link'">Pricing</nuxt-link>
            <nuxt-link to="/roadmap" :class="route.path == '/roadmap' ? 'link-active' : 'link'">Roadmap</nuxt-link>
            <nuxt-link to="/developers" :class="route.path == '/developers' ? 'link-active' : 'link'">Developers</nuxt-link>
        </div>

        <nuxt-link class="login" to="/login">
            Sign in
        </nuxt-link>
    </nav>
</template>

<style lang="scss" scoped>
.nav {
    position: static;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    height: fit-content;
    width: 100%;

    padding-top: 20px;
}

.brand {
    font-weight: 700;
    font-size: 1.5rem;
    text-decoration: none;
    color: white;
}

.links {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.link {
    width: 30%;

    margin: 0 1.5rem;

    text-decoration: none;
    color: $gray1;

    &:hover {
        cursor: pointer;
    }

    &-active {
        @extend .link;

        color: $blue;
    }
}

.login {
    text-decoration: none;
    color: $dark-blue;
}
</style>

<script setup>
const route = useRoute()
</script>