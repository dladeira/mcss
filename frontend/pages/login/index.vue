<template>
    <div>

        <Head>
            <Title>Login</Title>
        </Head>
        <h1 class="title">Welcome <span class="title-green">back</span></h1>

        <div class="panels">
            <form @submit.prevent="register" class="panel">
                <h2 class="panel-title">Sign up</h2>

                <SharedFormInput type="email" placeholder="user@example.com" label="Email" name="email" :disabled="connecting" />
                <SharedFormInput type="password" placeholder="********" label="Password" name="password" :disabled="connecting" />
                <SharedFormInput type="password" placeholder="********" label="Confirm Password" name="password2" :disabled="connecting" />
                <SharedCheckInput tos name="tos" :disabled="connecting" />

                <button v-if="!registerSuccess" class="submit signup" type="submit" :disabled="connecting" :class="connecting ? 'signup-connecting' : ''">Sign up</button>
                <button v-else class="submit signup" type="submit" :disabled="connecting" :class="connecting ? 'signup-finished' : ''">Check your email</button>
                <div v-if="registerError" class="error">{{ registerError }}</div>
            </form>

            <form @submit.prevent="login" class="panel">
                <h2 class="panel-title">Login</h2>
                <SharedFormInput type="email" placeholder="user@example.com" label="Email" name="email" :disabled="connecting" />
                <SharedFormInput type="password" placeholder="********" label="Password" name="password" helper="Forgot Passowrd?" :disabled="connecting" @helper="navigateTo('/login/reset-pwd')" />
                <SharedCheckInput label="Stay logged in" name="remember" :value="true" :disabled="connecting" />

                <button v-if="!registerSuccess" class="submit login" type="submit" :disabled="connecting" :class="connecting ? 'login-connecting' : ''">Login</button>
                <button v-if="registerSuccess" class="submit login" :disabled="connecting" :class="connecting ? 'login-connecting' : ''">Login</button>
                <div v-if="loginError" class="error">{{ loginError }}</div>
            </form>
        </div>
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

.panels {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    width: 850px;

    margin: 0 auto;
}

.panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    width: 400px;

    padding: 0 30px;

    border: 1px rgba(white, 0.1) solid;
    border-radius: 10px;

    background-color: rgba(black, 0.15);
}

.panel-title {
    margin: 15px 0 25px;
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

.signup {
    background-color: rgba($green, 0.5);

    &:hover {
        background-color: darken(rgba($green, 0.5), 4);
        cursor: pointer;
    }

    &-connecting {
        background-color: rgba($green, 0.2);
        color: rgba(white, 0.75);

        &:hover {
            background-color: rgba($green, 0.2);
            cursor: default;
        }
    }

    &-finished {
        @extend .signup-connecting;

        background-color: rgba($green, 0.3);
        color: rgba(white, 1);

        &:hover {
            background-color: rgba($green, 0.3);
            cursor: default;
        }
    }
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

.forgot {
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    &-link {
        font-size: 0.75rem;
        font-weight: 300;
        text-decoration: none;
        color: $blue;
    }
}

.error {
    margin-bottom: 20px;

    font-size: 1em;
    text-align: center;
    color: $red;
}
</style>

<script setup>
const config = useRuntimeConfig()
const connecting = ref()
const registerError = ref()
const registerSuccess = ref()
const loginError = ref()
const token = useCookie("token", {
    maxAge: 2592000,
    sameSite: 'lax'
})

async function register(e) {
    connecting.value = true
    const { data, error } = await useFetch(config.public.origin + "/api/auth/register", {
        method: "POST",
        body: {
            email: e.target.email.value,
            password: e.target.password.value,
            password2: e.target.password2.value,
            tos: e.target.tos.checked
        }
    })

    if (error.value) {
        registerError.value = error.value.data.error
        connecting.value = false
        return
    }

    registerSuccess.value = true
    registerError.value = null
}

async function login(e) {
    connecting.value = true
    const { data, error } = await useFetch(config.public.origin + "/api/auth/login", {
        method: "POST",
        body: {

            email: e.target.email.value,
            password: e.target.password.value,
        }
    })

    if (error.value) {
        loginError.value = error.value.data.error
        connecting.value = false
        return
    }

    if (!e.target.remember.checked) {
        window.onbeforeunload = () => {
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        }
    }

    token.value = data.value.token
    navigateTo("/u/servers")
}

definePageMeta({
    pageTransition: {
        name: 'slide-left'
    },
    layout: 'landing'
})
</script>