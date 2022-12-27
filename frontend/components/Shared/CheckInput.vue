<template>
    <div class="term">
        <input :id="name" class="term-input" type="checkbox" :name="name" :disabled="disabled" />
        <label tabindex=0 class="term-box" :for="name" />
        <p v-if="tos" class="term-text">
            I have read and agreed to the
            <a href="https://example.com/" class="term-text-bold">terms of service</a>
        </p>
        <p v-else class="term-text">{{ label }}</p>
    </div>
</template>

<style lang="scss" scoped>
.term {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    width: 100%;

    margin-bottom: 20px;
}

.term-input {
    display: none;
}

.term-box {
    min-height: 20px;
    min-width: 20px;

    background-color: rgba(white, 0.1);

    border-radius: 5px;

    &:hover {
        background-color: rgba(white, 0.2);
    }
}

.term-input:checked~.term-box {
    background-color: $blue;

    &:hover {
        background-color: rgba($blue, 0.8);
    }
}

.term-text {

    margin: 0;
    margin-left: 15px;

    font-weight: 300;

    &-bold {
        font-weight: 700;
        text-decoration: none;
        color: $blue;
    }
}
</style>

<script setup>
const props = defineProps({
    label: String,
    disabled: String,
    name: String,
    tos: Boolean
})
</script>