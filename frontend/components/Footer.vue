<template>
    <div class="footer-wrapper">
        <footer class="footer">
            <div class="brand">
                <h1 class="title">MCSS</h1>
                <h2 class="subtitle">© 2022 Daniel Ladeira. All Rights Reserved.</h2>
                <p class="description">
                    MCSS is not affiliated with Minecraft.
                    <br />
                    Minecraft is the official trademark of Mojang.
                </p>
            </div>

            <div class="sitemap">
                <div class="header">
                    Sitemap
                </div>

                <div class="links">
                    <div class="link-column">
                        <p class="link">Home</p>
                        <p class="link">Login</p>
                        <p class="link">Sign up</p>
                    </div>
                    <div class="link-column">
                        <p class="link">Overview</p>
                        <p class="link">Account</p>
                        <p class="link">Plans</p>
                    </div>
                </div>
            </div>

            <div class="extra">
                <p class="extra-name">Made by Daniel Ladeira</p>
                <p class="extra-hire">Available for hire</p>
            </div>
        </footer>
    </div>
</template>

<style lang="scss" scoped>
.footer-wrapper {
    height: 160px;
    width: 100%;

    background-color: rgba(0, 0, 0, 0.2);

    overflow-y: hidden;
}

.footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;

    height: 160px;
    width: 1200px;
    max-width: 70%;

    margin: 0 auto;
    padding-bottom: 1.25rem;
}

.brand {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

.title {
    margin: 0;

    font-size: 2.5rem;
    color: $gray3;
}

.subtitle {
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;

    font-size: 0.75rem;
    font-weight: 400;
    color: $gray3;
}

.description {
    margin: 0;

    color: $gray3;

    font-size: 0.55rem;
    line-height: 0.8rem;
}

.sitemap {
    margin-left: 8rem;
}

.header {
    color: $gray3;
}

.links {
    display: flex;
    flex-direction: row;
}

.link-column {
    margin-right: 2.5em;
}

.link {
    margin: 0;
    margin-top: 15px;

    font-size: 0.7rem;
    font-weight: 400;
    text-decoration: underline;
    color: $gray4;
}

.extra {
    margin-top: auto;
    margin-left: auto;
}

.extra-name {
    margin: 0;
    margin-bottom: 0.5rem;

    font-size: 0.75rem;
    color: $gray3;
}

.extra-hire {
    margin: 0;

    font-size: 0.75rem;
    text-align: right;
    color: $blue;
}
</style>