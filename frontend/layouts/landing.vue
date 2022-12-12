<template>
    <div class="wrapper">
        <div class="inner-wrapper">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper,
.inner-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;

    width: 100%;

    background-color: $dark1;

    overflow-x: hidden;
}

.inner-wrapper {
    background-image: $gradient-main;
}
</style>