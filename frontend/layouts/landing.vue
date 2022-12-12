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

    height: 100%;
    width: 100%;

    background-color: $dark1;

    overflow-x: hidden;

    // SCROLLBAR

    ::-webkit-scrollbar {
        width: 8px;
        
        background-color: rgba(255, 255, 255, 0.057);

        border-radius: 100px;
        -webkit-border-radius: 100px;
    }

    ::-webkit-scrollbar:hover {
        background-color: rgba(255, 255, 255, 0.109);
    }

    ::-webkit-scrollbar-thumb:vertical {
        background: rgba(255, 255, 255, 0.254);
        
        border-radius: 100px;
        -webkit-border-radius: 100px;
    }

    ::-webkit-scrollbar-thumb:vertical:active {
        background: darken(rgba(255, 255, 255, 0.254), 10);
        
        border-radius: 100px;
        -webkit-border-radius: 100px;
    }
}

.inner-wrapper {
    background-image: $gradient-main;
}
</style>