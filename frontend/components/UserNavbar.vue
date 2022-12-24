<template>
    <div class="nav-wrapper">
        <nav class="nav">
            <nuxt-link to="/u/servers" class="brand">
                MCSS
            </nuxt-link>

            <div class="links-main">
                <nuxt-link to="/u/servers" :class="route == '/u/servers' ? 'link-selected' : 'link'">Servers</nuxt-link>
                <nuxt-link to="/u/account" :class="route == '/u/account' ? 'link-selected' : 'link'">Account</nuxt-link>
                <nuxt-link to="/u/plans" :class="route == '/u/plans' ? 'link-selected' : 'link'">Plans</nuxt-link>
            </div>

            <div class="server">
                <div class="links-server">
                    <div class="link">Overview</div>
                    <div class="link">Players</div>
                    <div class="link">Statistics</div>
                    <div class="link">Surveys</div>
                </div>
                <div class="divider" />
                <div class="selected">ChromoMC</div>
            </div>
        </nav>
    </div>
</template>

<style lang="scss" scoped>
.nav-wrapper {
    border-bottom: 1px solid rgba(white, 0.15);
}

.nav {
    position: static;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    height: fit-content;
    width: 1600px;
    max-width: 90%;

    margin: 0 auto;
    padding: 20px 0 20px 0;
}

.brand {
    margin-right: 1rem;

    font-weight: 700;
    font-size: 1.5rem;
    text-decoration: none;
    color: white;
}

.links-main,
.links-server {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.server {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-left: auto;
}

.link {
    width: 30%;

    margin: 0 1rem;

    text-decoration: none;
    color: $gray1;

    &:hover {
        cursor: pointer;
    }

    &-selected {
        @extend .link;

        color: $blue;
    }
}

.divider {
    height: 12px;
    width: 1px;

    margin: 0 24px 0 10px;

    background-color: $gray2;
}
</style>

<script setup>
const route = ref(useRoute().path)
</script>