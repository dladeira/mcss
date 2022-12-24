<template>
    <div class="component">
        <h1 class="title">Language</h1>
        <form>
            <div class="field">
                <label for="bug" class="field-title">
                    Report Bug
                </label>
                <textarea id="bug" class="field-input" type="text" name="language"
                    placeholder="Describe the issue in 3-5 sentences" />
            </div>
            <div class="report">Submit Report</div>
        </form>

        <form>
            <div class="field">
                <label for="feature" class="field-title">
                    Suggest a new feature
                </label>
                <textarea id="feature" class="field-input" type="text" name="language"
                    placeholder="Describe the issue in 3-5 sentences" />
            </div>
            <div class="feature">Submit Feature</div>
        </form>
    </div>
</template>

<style lang="scss" scoped>
.component {
    display: flex;
    flex-direction: column;

    height: 26.75rem;

    margin-bottom: 20px;

    background-color: $gray6;
}

.title {
    margin: 10px 0 2rem 18px;

    font-size: 1.25rem;
    font-weight: 700;
}

.field {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    padding: 0 10px;

    flex-grow: 1;

    &-title {
        margin-bottom: 0.5rem;

        font-weight: 500;
    }

    &-input {
        min-height: 6rem;
        width: 100%;

        padding: 8px 0 8px 12px;

        border: 1px rgba(white, 0.25) solid;

        font-size: 1rem;
        font-family: 'Inter';
        background-color: rgba(black, 0.1);
        color: white;

        resize: none;

        &:placeholder {
            color: $gray5;
        }
    }
}

.feature,
.report {
    display: flex;
    justify-content: center;
    align-items: center;

    width: fit-content;

    margin: 0.5rem 0 1rem 10px;
    padding: 0.5rem 2rem;
}

.report {
    background-color: rgba($red, 0.2);
    color: red;
}

.feature {
    background-color: rgba($blue, 0.2);
    color: $blue;
}
</style>