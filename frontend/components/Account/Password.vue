<template>
    <form class="component" @submit.prevent="resetPassword">
        <h1 class="panel-title">Change Password</h1>
        <div class="row">
            <SharedFormInput class="input" label="Old Password" type="password" placeholder="********" name="old" :disabled="success" />
            <SharedFormInput class="input" label="New Password" type="password" placeholder="********" name="new1" :disabled="success" />
        </div>

        <div class="row">
            <SharedFormInput class="input" label="Confirm Password" type="password" placeholder="********" name="new2" :disabled="success" />
            <div class="submit-wrapper">
                <button :class="success ? 'submit-success' : 'submit'" type="submit" :disabled="success">
                    {{ success ? 'Password changed' : 'Change password' }}
                </button>
            </div>
        </div>

        <div class="bottom">

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

    border-radius: 5px;

    font-size: 0.75rem !important;
    background-color: $panel;
}

.panel-title {
    margin: 1rem 0 1.5rem 1rem;

    font-size: 1rem;
    font-weight: 400;
}

.input {
    width: 49%;

    margin: 0 0 0.5rem 0;
    padding: 0 15px !important;
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 0 5px;
    margin-top: 0.5rem;
}



.submit-wrapper {
    width: 47%;

    padding-right: 20px;
}

.submit {
    height: 2rem;
    width: 100%;

    margin: 0.75rem 10px 0 5px;
    padding: 9px 1.5rem;

    border: none;
    border-radius: 5px;

    font-size: 0.75rem;
    font-weight: 400;
    background-color: rgba($green, 0.3);
    color: white;

    outline: none;

    &:hover {
        background-color: darken(rgba($green, 0.3), 4);
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