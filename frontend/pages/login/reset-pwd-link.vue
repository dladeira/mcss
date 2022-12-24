<template>
    <NuxtLayout name="landing">
        <h1 class="title">Welcome <span class="title-green">back</span></h1>

        <form @submit.prevent="setPassword" class="panel">
            <h2 class="panel-title">Reset Password</h2>
            <div class="field">
                <label for="pwd" class="field-title">
                    New Password
                </label>
                <input id="pwd" class="field-input" type="password" name="password" placeholder="********"
                    :disabled="connecting" />
                <input type="hidden" :value="$route.query.code" name="code" />
            </div>
            <div v-if="!success" class="submit-wrapper"><button class="submit login" type="submit"
                    :disabled="connecting" :class="connecting ? 'login-connecting' : ''">Change Password</button></div>
            <div v-if="success" class="submit-wrapper"><button class="submit login" :disabled="connecting"
                    :class="connecting ? 'login-connecting' : ''">Change Password</button></div>


            <div v-if="success" class="success">{{ success }}</div>
            <div v-else-if="error" class="error">{{ error }}</div>
        </form>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.title {
    margin: 116px auto 60px auto;

    width: fit-content;

    font-size: 4rem;

    &-green {
        color: #00FF75;
    }
}

.panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    width: 400px;

    margin: 0 auto;

    border: 1px rgba(white, 0.1) solid;
    border-radius: 10px;

    background-color: rgba(black, 0.15);
}

.panel-title {
    margin: 15px 0 25px;
}

.field {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    width: 100%;

    margin-bottom: 20px;
    padding: 0 30px;

    &-title {
        margin-bottom: 8px;

        font-weight: 500;
    }

    &-input {
        width: 100%;

        padding: 8px 0 8px 12px;

        border: 1px rgba(white, 0.25) solid;
        border-radius: 5px;

        font-size: 1rem;
        background-color: rgba(black, 0.1);
        color: white;

        &:placeholder {

            color: $gray5;
        }
    }
}

.submit-wrapper {
    width: 100%;

    padding: 0 30px;
}

.submit {
    width: 100%;

    margin-bottom: 20px;
    padding: 9px 0;

    border-radius: 1000px;
    border: none;

    font-size: 1rem;
    font-weight: 500;
    background-color: rgba(white, 0.2);
    color: white;

    outline: none;
}

.login {
    background-color: rgba($blue, 0.5);

    &:hover {
        background-color: darken(rgba($blue, 0.5), 4);
        cursor: pointer;
    }

    &-connecting {
        background-color: rgba($blue, 0.5);
        color: rgba(white, 0.75);

        &:hover {
            background-color: rgba($blue, 0.5);
            cursor: default;
        }
    }
}

.error {
    margin-bottom: 20px;

    font-size: 1em;
    color: $red;
}

.success {
    @extend .error;
    color: $green;
}
</style>

<script setup>
const connecting = ref()
const error = ref()
const success = ref()

async function setPassword(e) {
    connecting.value = true
    const { data, error: fetchError } = await useFetch("/api/auth/pwd-reset-link", {
        method: "POST",
        body: {
            password: e.target.password.value,
            code: e.target.code.value
        }
    })

    if (fetchError.value) {
        error.value = fetchError.value.data.error
        connecting.value = false
        return
    }

    success.value = data.value.success
    error.value = null
}
</script>