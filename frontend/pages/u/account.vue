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

    margin: 1rem auto 3rem auto;

    font-size: 2.75rem;
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