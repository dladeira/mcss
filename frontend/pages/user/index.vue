<template>
    <NuxtLayout name="user">
        <div v-if="user" class="data">
            TOKEN
            <br />
            {{ token }}
            <br />
            <br />
            USER DATA
            <br />
            {{ user }}
            <br />
            <br />
            <button @click="getUserData">Refresh Data</button>
            <button @click="logout">Logout</button>
        </div>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.data {
    margin-top: 100px;
}
</style>

<script setup>
const user = ref()

const token = useCookie("token", {
    maxAge: 2592000,
    sameSite: 'lax'
})

if (!token || token.value.length == 0) {
    navigateTo("/")
}

function logout() {
    token.value = ""
    navigateTo("/")
}

async function getUserData() {
    const { data, error } = await useFetch("/api/auth/user", {
        method: "GET",
        credentials: "same-origin"
    })

    if (error.value) {
        return console.log("Forbidden user data")
    }

    user.value = data.value
    console.log(user.value)
}

onBeforeMount(() => {
    setTimeout(() => {
        getUserData()
    }, 1)
})
</script>