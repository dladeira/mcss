<template>
    <nav class="nav">
        <div class="brand">
            MCSS
        </div>

        <div class="links">
            <div class="link">Features</div>
            <div class="link">Pricing</div>
            <div class="link">Roadmap</div>
        </div>

        <nuxt-link class="login" to="login">
            Sign in
        </nuxt-link>
    </nav>
</template>

<style lang="scss" scoped>
.nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    height: fit-content;
    width: 100%;
}

.brand {
    font-weight: 700;
    font-size: 1.5rem;
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

    color: $gray1;

    &:hover {
        cursor: pointer;
    }
}

.login {
    text-decoration: none;
    color: $dark-blue;
}
</style>