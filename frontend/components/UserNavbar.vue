<template>
    <div class="nav-wrapper">
        <nav class="nav">
            <nuxt-link to="/user" class="brand">
                MCSS
            </nuxt-link>

            <div class="links-main">
                <div class="link">Servers</div>
                <div class="link">Account</div>
                <div class="link">Plans</div>
            </div>

            <div class="server">
                <div class="links-server">
                    <div class="link">Overview</div>
                    <div class="link">Players</div>
                    <div class="link">Statistics</div>
                    <div class="link">Surveys</div>
                </div>
                <div class="divider" />
                <div class="server">ChromoMC</div>
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
    margin-right: 10px;

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

    color: $gray1;

    &:hover {
        cursor: pointer;
    }
}

.divider {
    height: 12px;
    width: 1px;

    margin: 0 24px 0 10px;

    background-color: $gray2;
}
</style>