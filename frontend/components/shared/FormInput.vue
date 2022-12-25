<template>
    <div class="field">
        <div class="title">
            <label :for="name" class="label">
                {{ label }}
            </label>

            <div class="helper" @click="$emit('helper')">
                {{ helper }}
            </div>
        </div>

        <input class="input" :id="name" :type=type :name="name" :placeholder="placeholder" :disabled="disabled" />
    </div>
</template>

<style lang="scss" scoped>
.field {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    width: 100%;

    margin-bottom: 20px;
}

.title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    margin-bottom: 8px;
}

label {
    font-weight: 500;
}

.helper {
    font-size: 0.75rem;
    font-weight: 300;
    text-decoration: none;
    color: $blue;

    &:hover {
        color: darken($blue, 10);

        cursor: pointer;
    }
}

input {
    width: 100%;

    padding: 8px 0 8px 12px;

    border: 1px rgba(white, 0.3) solid;
    border-radius: 5px;

    font-size: 1rem;
    background-color: rgba(black, 0.1);
    color: white;

    &::placeholder {
        color: lighten($gray5, 20);
    }

    &:disabled {
        border-color: rgba(white, 0.1);

        background-color: rgba(black, 0.05);
        color: $gray5;
    }
}
</style>

<script setup>
const props = defineProps({
    label: String,
    helper: String,
    type: String,
    name: String,
    placeholder: String,
    disabled: String,
})

const emit = defineEmits(['helper'])
</script>