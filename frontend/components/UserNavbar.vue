<template>
    <nav class="nav">
        <nuxt-link to="/u/servers" class="brand">
            MCSS
        </nuxt-link>

        <div class="links-main">
            <nuxt-link to="/u/servers" :class="route.path == '/u/servers' ? 'link-selected' : 'link'">Servers</nuxt-link>
            <nuxt-link to="/u/account" :class="route.path == '/u/account' ? 'link-selected' : 'link'">Account</nuxt-link>
            <!-- <nuxt-link to="/u/plans" :class="route.path == '/u/plans' ? 'link-selected' : 'link'">Plans</nuxt-link> -->
        </div>

        <div class="server">
            <div class="links-server">
                <nuxt-link to="/u/server/overview" :class="route.path == '/u/server/overview' ? 'link-selected' : 'link'">Overview</nuxt-link>
                <nuxt-link to="/u/server/players" :class="route.path == '/u/server/players' ? 'link-selected' : 'link'">Players</nuxt-link>
                <nuxt-link to="/u/server/statistics" :class="route.path == '/u/server/statistics' ? 'link-selected' : 'link'">Statistics</nuxt-link>
                <!-- <div class="link">Surveys</div> -->
            </div>
            <div class="divider" />
            <div class="select-wrapper">
                <div class="select" :class="optionsOpen ? 'select-open' : 'select-closed'" @click="optionsOpen = !optionsOpen">
                    {{ activeServer? activeServer.name : "None" }}
                </div>

                <div class="select-options" v-if="optionsOpen">
                    <div v-for="server in servers" class="select-option" @click="changeServer(server._id)">{{ server.name }}</div>
                </div>
            </div>
        </div>
    </nav>
</template>

<style lang="scss" scoped>
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
    padding: 20px 0;
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

    font-weight: 300;
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

.select-wrapper {
    position: relative;
}

.select {
    position: relative;

    width: fit-content;

    padding: 6px 40px 6px 20px;

    border: none;
    border-radius: 1000px;

    font-size: 0.75rem;
    background-color: rgba(white, 0.1);
    color: $gray1;

    &:hover {
        color: white;
        cursor: pointer;
    }
}

.select-closed:after {
    position: absolute;
    top: 12px;
    right: 12px;

    height: 0;
    width: 0;

    border: 5px solid transparent;
    border-color: $gray1 transparent transparent transparent;

    content: "";
}

.select-open:after {
    position: absolute;
    top: 6px;
    right: 12px;

    height: 0;
    width: 0;

    border: 5px solid transparent;
    border-color: transparent transparent $gray1 transparent;

    content: "";
}

.select-options {
    position: absolute;
    top: 35px;

    border-radius: 5px;

    background-color: $gray6;

    z-index: 2;
}

.select-option {
    width: 100%;

    padding: 15px;

    border-bottom: 1px solid rgba(white, 0.1);

    font-size: 0.75rem;

    &:hover {
        cursor: pointer;

        background-color: rgba(black, 0.1);
    }
}

.select-option:last-of-type {
    border-bottom: none;
}
</style>

<script setup>
const servers = useState("servers")
const route = useRoute()
const activeServerCookie = useCookie("activeServer", {
    maxAge: 2592000,
    sameSite: 'lax'
})

const activeServer = useState("activeServer")

const optionsOpen = ref()
function changeServer(serverId) {
    activeServerCookie.value = serverId
    activeServer.value = servers.value.find(server => server._id == serverId)
    optionsOpen.value = false
}
</script>