<template>    
    <div class="wrapper">
        <div class="inner-wrapper">
            <div class="page">
                <LandingNavbar />
                <slot />
            </div>
            <Footer />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper,
.inner-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;

    min-height: calc(100vh + 140px);
    width: 100%;

    background-color: $dark1;

    overflow-x: hidden;
}

.inner-wrapper {
    background-image: $gradient-main;
}

.page {
    width: 1200px;
    max-width: 70%;

    margin: 0 auto;
}
</style>

<script setup>
const token = useCookie("token", {
    maxAge: 2592000,
    sameSite: 'lax'
})

if (token.value && token.value.length > 0)
    navigateTo("/u/servers")
</script>