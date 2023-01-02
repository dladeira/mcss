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

        <div class="input">
            <input class="slider" :min="min" :max="max" :id="name" type="range" :name="name" :placeholder="placeholder" :disabled="disabled" @input="sliderChange" :step="step" :value="value" />
            <div class="text">
                <span class="text-bolded">{{ Number.parseFloat(value).toFixed(1) }}</span>/{{max}}MB
            </div>
        </div>
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

.slider {
    appearance: none;

    height: 4px;
    width: 100%;

    border-radius: 1000px;

    background-color: white;

    opacity: 0.8;

    &:hover {
        opacity: 1;
    }

    &::-webkit-slider-thumb {
        appearance: none;

        height: 15px;
        width: 15px;

        border-radius: 1000px;

        background-color: $blue;

        box-shadow: 0 0 10px 0 rgba($blue, 0.5);
    }
}

.input {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    padding: 0.45rem 0.5rem;

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

.text {
    width: 7.5rem;

    font-weight: 600;
    text-align: right;
    color: $gray1;

    &-bolded {
        color: $blue;
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
    disabled: Boolean,
    max: Number,
    min: Number,
    value: Number,
    step: Number
})

const emit = defineEmits(['helper'])

const value = ref(props.value ? props.value : Math.floor(props.max / 2))
const step = ref(props.step ? props.step : 0.5)

function sliderChange(e) {
    value.value = e.target.value
}
</script>