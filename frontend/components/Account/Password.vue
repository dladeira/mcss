<template>
    <form class="component" @submit.prevent="resetPassword">
        <h1 class="title">Change Password</h1>
        <div class="old-password">
            <div class="field">
                <label for="old" class="field-title">
                    Old Password
                </label>
                <input id="old" class="field-input" type="password" name="old" placeholder="********" :disabled="success" />
            </div>
        </div>

        <div class="new-password">
            <div class="password1">
                <div class="field">
                    <label for="new1" class="field-title">
                        New Password
                    </label>
                    <input id="new1" class="field-input" type="password" name="new1" placeholder="********" :disabled="success" />
                </div>

            </div>
            <div class="password2">
                <div class="field">
                    <label for="new2" class="field-title">
                        Confirm Password
                    </label>
                    <input id="new2" class="field-input" type="password" name="new2" placeholder="********" :disabled="success" />
                </div>
            </div>
        </div>

        <div class="bottom">
            <div class="submit-wrapper"><button :class="success ? 'submit-success' : 'submit'" type="submit" :disabled="success" >{{ success ?
                    'Password changed' : 'Change password'
            }}</button></div>
            <div class="error" v-if="errorMsg">{{ errorMsg }}</div>
        </div>
    </form>
</template>

<style lang="scss" scoped>
.component {
    display: flex;
    flex-direction: column;

    height: 17rem;

    margin-bottom: 20px;

    background-color: $gray6;
}

.title {
    margin: 10px 0 2rem 18px;

    font-size: 1.25rem;
    font-weight: 700;
}

.old-password {
    padding: 0 5px;
}

.new-password {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 0 5px;
}

.field {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    width: 100%;

    margin-bottom: 1rem;
    padding: 0 10px;

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

.submit-wrapper {
    width: fit-content;

    padding: 0 10px;
}

.submit {
    width: fit-content;

    margin: 0 10px 0 5px;
    padding: 9px 30px;

    border: none;

    font-size: 1rem;
    font-weight: 500;
    background-color: rgba($green, 0.2);
    color: $green;

    outline: none;

    &:hover {
        background-color: darken(rgba($green, 0.2), 4);
        cursor: pointer;
    }

    &-success {
        @extend .submit;

        background-color: rgba($blue, 0.1);
        color: rgba($blue, 0.6);

        &:hover {
            background-color: rgba($blue, 0.1);
            cursor: default;
        }
    }
}

.bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 1005;
}

.error {
    flex-grow: 1;

    font-size: 0.75rem;
    text-align: left;
    color: $red;
}
</style>

<script setup>
const errorMsg = ref()
const success = ref()

async function resetPassword(e) {
    const { error } = await useFetch('/api/auth/pwd-change', {
        method: "POST",
        body: {
            old: e.target.old.value,
            new1: e.target.new1.value,
            new2: e.target.new2.value
        }
    })

    if (error.value) {
        const { no_match, incorrect } = error.value.data

        if (no_match) {
            errorMsg.value = "New password doesn't match"
        } else if (incorrect) {
            errorMsg.value = "Old password incorrect"
        }

        return
    }

    errorMsg.value = ""
    success.value = true
}
</script>