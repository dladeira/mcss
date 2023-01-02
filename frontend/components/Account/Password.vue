<template>
    <form class="component" @submit.prevent="resetPassword">
        <h1 class="title">Change Password</h1>
        <SharedFormInput class="old" label="Old Password" type="password" placeholder="********" name="old" :disabled="success" />

        <div class="new-password">
            <SharedFormInput class="new" label="New Password" type="password" placeholder="********" name="new1" :disabled="success" />
            <SharedFormInput class="new" label="Confirm Password" type="password" placeholder="********" name="new2" :disabled="success" />
        </div>

        <div class="bottom">
            <div class="submit-wrapper"><button :class="success ? 'submit-success' : 'submit'" type="submit" :disabled="success">{{ success ?
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

    height: fit-content;

    margin-bottom: 20px;

    background-color: $gray6;
}

.title {
    margin: 10px 0 2rem 18px;

    font-size: 1.25rem;
    font-weight: 700;
}

.old {
    margin-bottom: 2rem !important;
    padding: 0 15px !important;
}

.new-password {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 0 5px;
    margin-bottom: 0.5rem;
}

.new {
    max-width: 49%;

    padding: 0 10px;
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
    font-weight: 400;
    background-color: rgba($green, 0.1);
    color: $green;

    outline: none;

    &:hover {
        background-color: darken(rgba($green, 0.1), 4);
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

    width: 100%;

    margin-bottom: 1rem;
}

.error {
    flex-grow: 1;

    margin-right: 1rem;

    font-size: 0.75rem;
    text-align: left;
    color: $red;
}
</style>

<script setup>
const errorMsg = ref()
const success = ref()
const config = useRuntimeConfig()

async function resetPassword(e) {
    const { error } = await useFetch(config.public.origin + '/api/auth/pwd-change', {
        method: "POST",
        body: {
            old: e.target.old.value,
            new1: e.target.new1.value,
            new2: e.target.new2.value
        }
    })

    if (error.value)
        return errorMsg.value = error.value.data.error

    errorMsg.value = ""
    success.value = true
}
</script>