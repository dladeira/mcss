<template>
    <div class="panel dial">
        <h3 class="dial-title">
            {{ name }}
        </h3>
        <div class="dial-outer">
            <div class="dial-inner" :style="{ borderColor: color }">
                <div class="usage">
                    {{ value }}
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dial {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    height: 100%;
    width: 100%;

    padding: 0.75rem 0;
}

.dial-title {
    width: fit-content;

    margin: 0;

    font-size: 1.25rem;
    font-weight: 600;
    color: white;
}

.dial-outer {
    height: 6.5rem;
    width: 6.5rem;

    padding: 12px;

    border-radius: 1000px;

    background-color: rgba(#263559, 0.4);
}

.dial-inner {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: 100%;

    border: 6px rgba($blue, 0.8) solid;
    border-radius: 1000px;
}
</style>

<script setup>
const props = defineProps({
    name: String,
    value: String,
    color: String
})
</script>