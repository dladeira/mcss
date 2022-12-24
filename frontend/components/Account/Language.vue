<template>
    <div class="component">
        <h1 class="title">Language</h1>
        <div class="row">
            <div class="field">
                <label for="language" class="field-title">
                    Website Language
                </label>
                <input id="language" class="field-input" type="text" name="language" value="English" />
            </div>

            <a class="help" href="http://example.com"> Help Translate</a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.component {
    display: flex;
    flex-direction: column;

    height: 9rem;

    margin-bottom: 20px;

    background-color: $gray6;
}

.title {
    margin: 10px 0 2rem 18px;

    font-size: 1.25rem;
    font-weight: 700;
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;

    padding: 0 10px;
}

.field {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    margin-right: 10px;
    padding: 0 10px;

    flex-grow: 1;

    &-title {
        margin-bottom: 8px;

        font-weight: 500;
    }

    &-input {
        width: 100%;

        padding: 8px 0 8px 12px;

        border: 1px rgba(white, 0.25) solid;

        font-size: 1rem;
        background-color: rgba(black, 0.1);
        color: white;

        &:placeholder {

            color: $gray5;
        }
    }
}

.help {
    display: flex;
    justify-content: center;
    align-items: center;

    min-width: 10rem;

    padding: 10px 20px;

    text-decoration: none;
    background-color: rgba(white, 0.1);
    color: white;
}
</style>