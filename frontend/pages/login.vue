<template>
    <div>
        MCSS - Login Token: {{ token }}

        <template v-if="!token">
            <form @submit.prevent="login">
                <input type="text" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Login</button>
                {{ loginError }}
            </form>

            <form @submit.prevent="register" v-if="!token">
                <input type="text" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <input type="password" name="password2" placeholder="Confirm Password" />
                <button type="submit">Register</button>
                {{ registerError }}
            </form>
        </template>
        <template v-else>
            <form @submit.prevent="logout">
                <button type="submit">Logout</button>
            </form>
        </template>

        <form @submit.prevent="getUserData">
            {{ userData }}
            <button type="submit">Get User Data</button>
        </form>
    </div>
</template>

<script setup>
const registerError = ref()
const loginError = ref()
const userData = ref()
const token = useCookie("token", {
    maxAge: 2592000,
    sameSite: 'lax'
})

async function register(e) {
    const { data, error } = await useFetch("/api/auth/register", {
        method: "POST",
        body: {
            email: e.target.email.value,
            password: e.target.password.value,
            password2: e.target.password2.value
        }
    })

    if (error.value) {
        const { no_match } = error.value.data

        if (no_match) {
            registerError.value = "Passwords do not match"
        }

        return
    }

    token.value = data.value.token
}

async function login(e) {
    const { data, error } = await useFetch("/api/auth/login", {
        method: "POST",
        body: {
            email: e.target.email.value,
            password: e.target.password.value,
        }
    })

    if (error.value) {
        const { invalid_login } = error.value.data

        if (invalid_login) {
            loginError.value = "Email or password incorrect"
        }

        return
    }

    token.value = data.value.token
}

function logout() {
    token.value = ""
}

async function getUserData() {
    const { data, error } = await useFetch("/api/auth/user", {
        method: "GET",
        credentials: "same-origin"
    })

    if (error.value) {
        return console.log("Forbidden user data")
    }

    console.log(data.value.user)
}
</script>