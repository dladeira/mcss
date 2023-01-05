<template>
    <div>

        <Head>
            <Title>Account</Title>
        </Head>

        <NuxtLayout name="user">
            <div class="title">Account</div>

            <div class="grid">
                <div class="column">
                    <!-- <AccountLanguage /> -->
                    <!-- <AccountBugs /> -->
                    <AccountPassword />
                </div>
                <div class="column">
                    <AccountEmail />
                    <!-- <AccountPassword /> -->
                </div>
                <div class="column">
                    <!-- <div class="plan"></div> -->
                    <!-- <div class="control"></div> -->
                </div>
            </div>

            <button @click="logout" class="logout">
                Logout
            </button>
        </NuxtLayout>
    </div>
</template>

<style lang="scss" scoped>
.title {
    width: fit-content;

    margin: 3rem auto;

    font-size: 3rem;
    font-weight: 700;
}

.grid {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    width: 100%;
}

.column {
    width: 100%;

    margin: 0 10px;
}

.language,
.bugs,
.email,
.password,
.plan,
.control {
    margin-bottom: 20px;

    background-color: $gray6;
}

.language {
    height: 8rem;
}

.bugs {
    height: 20rem;
}

.email {
    height: 11rem;
}

.password {
    height: 16rem;
}

.plan {
    height: 9rem;
}

.control {
    height: 16rem;
}

.logout {
    width: fit-content;

    margin: auto;
    margin-bottom: 2rem;
    padding: 0.5rem 3rem;

    border: none;

    font-size: 1.25rem;
    background-color: rgba($red, 0.1);
    color: $red;

    &:hover {
        background-color: darken(rgba($red, 0.1), 4);

        cursor: pointer;
    }
}
</style>

<script setup>
const demo = useState('demo')
const servers = useState('servers')
const user = useState('user')
const token = useCookie("token", {
    maxAge: 2592000,
    sameSite: 'lax'
})
const activeServerCookie = useCookie("activeServer", {
    maxAge: 2592000,
    sameSite: 'lax'
})

function logout() {
    demo.value = false
    servers.value = undefined
    user.value = undefined
    token.value = ""
    activeServerCookie.value = ""
    navigateTo("/")
}
</script>