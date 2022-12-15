<template>
    <NuxtLayout name="landing">
        <h1 class="title">Welcome <span class="title-green">back</span></h1>

        <div class="panels">
            <form @submit.prevent="register" class="panel">
                <h2 class="panel-title">Sign up</h2>
                <div class="field">
                    <label for="email" class="field-title">
                        Email
                    </label>
                    <input class="field-input" type="text" name="email" placeholder="user@email.com" />
                </div>
                <div class="field">
                    <label for="password" class="field-title">
                        Password
                    </label>
                    <input class="field-input" type="password" name="password" placeholder="********" />
                </div>
                <div class="field">
                    <label for="password2" class="field-title">
                        Confirm Password
                    </label>
                    <input class="field-input" type="password" name="password2" placeholder="********" />
                </div>
                <div class="term">
                    <input id="terms" class="term-input" type="checkbox" name="terms" />
                    <label class="term-box" for="terms" />
                    <p class="term-text">I have read and agreed to the <a href="https://example.com/"
                            class="term-text-bold">terms of service</a></p>
                </div>
                <div class="submit-wrapper"><button class="submit signup" type="submit">Sign up</button></div>
            </form>

            <form @submit.prevent="login" class="panel">
                <h2 class="panel-title">Login</h2>
                <div class="field">
                    <label for="email" class="field-title">
                        Email
                    </label>
                    <input class="field-input" type="text" name="email" placeholder="user@email.com" />
                </div>
                <div class="field">
                    <label for="password" class="field-title">
                        Password
                    </label>
                    <input class="field-input" type="password" name="password" placeholder="********" />
                </div>
                <div class="term">
                    <input id="stay-logged" class="term-input" type="checkbox" name="terms" />
                    <label class="term-box" for="stay-logged" />
                    <p class="term-text">Stay logged in</p>
                </div>
                <div class="submit-wrapper"><button class="submit login" type="submit">Login</button></div>
            </form>
        </div>
        <!--
            <form @submit.prevent="logout">
            <button type="submit">Logout</button>
        </form>

        <form @submit.prevent="getUserData">
            {{ userData }}
            <button type="submit">Get User Data</button>
        </form>
    -->
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

.term {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    width: 100%;

    margin-bottom: 20px;
    padding: 0 30px;
}

.term-input {
    display: none;
}

.term-box {
    min-height: 20px;
    min-width: 20px;

    background-color: rgba(white, 0.1);

    border-radius: 5px;

    &:hover {
        background-color: rgba(white, 0.2);
    }
}

.term-input:checked~.term-box {
    background-color: white;

    &:hover {
        background-color: rgba(white, 0.8);
    }
}

.term-text {

    margin: 0;
    margin-left: 15px;

    font-weight: 300;

    &-bold {
        font-weight: 700;
        text-decoration: none;
        color: $blue;
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

.signup {
    background-color: rgba($green, 0.5);

    &:hover {
        background-color: darken(rgba($green, 0.5), 4);
        cursor: pointer;
    }
}

.login {
    background-color: rgba($blue, 0.5);

    &:hover {
        background-color: darken(rgba($blue, 0.5), 4);
        cursor: pointer;
    }
}
</style>

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
    navigateTo("/")
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
    navigateTo("/user")
}
</script>