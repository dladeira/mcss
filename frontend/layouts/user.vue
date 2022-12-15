<template>
    <div class="wrapper">
        <UserNavbar />
        <div class="page">
            <slot />
        </div>
        <Footer />
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    position: relative;
    display: flex;
    flex-direction: column;

    min-height: calc(100vh + 140px);
    width: 100%;

    background-color: $dark1;

    overflow-x: hidden;
}

.page {
    width: 1600px;
    max-width: 90%;

    margin: 0 auto;
}
</style>