<template>
    <div>

        <Head>
            <Title>Reset Password</Title>
        </Head>

        <h1 class="title">Forgot <span class="title-green">pwd?</span></h1>

        <form @submit.prevent="resetPassword" class="panel">
            <h2 class="panel-title">Reset Password</h2>
            <div class="field">
                <label for="email" class="field-title">
                    Email
                </label>
                <input class="field-input" type="email" name="email" placeholder="user@email.com" :disabled="connecting" />
            </div>
            <div v-if="!success" class="submit-wrapper"><button class="submit login" type="submit" :disabled="connecting" :class="connecting ? 'login-connecting' : ''">Send Email</button></div>
            <div v-if="success" class="submit-wrapper"><button class="submit login" :disabled="connecting" :class="connecting ? 'login-connecting' : ''">Send Email</button></div>


            <div v-if="success" class="success">{{ success }}</div>
            <div v-else-if="error" class="error">{{ error }}</div>
        </form>
    </div>
</template>

<style lang="scss" scoped>
.title {
    margin: 116px auto 60px;

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
const config = useRuntimeConfig()
const connecting = ref()
const error = ref()
const success = ref()

async function resetPassword(e) {
    connecting.value = true
    const { data, error: fetchError } = await useFetch(config.public.origin + "/api/auth/pwd-reset", {
        method: "POST",
        body: {
            email: e.target.email.value,
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

definePageMeta({
    pageTransition: {
        name: 'slide-left'
    },
    layout: 'landing'
})
</script>