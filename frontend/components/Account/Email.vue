<template>
    <div class="component">
        <h1 class="title">Change Email</h1>
        <div class="forms">
            <form class="form old-email" @submit.prevent="sendOldEmail">
                <SharedFormInput label="Old Email" type="email" :placeholder="user.email" name="email" disabled />
                <button v-if="!oldStatus" class="submit" type="submit">Send verification</button>
                <button v-else-if="oldStatus == 'waiting' && !oldVerified" class="submit-waiting" type="submit" disabled>Awaiting verification</button>
                <button v-else-if="oldVerified" class="submit-verified" type="submit" disabled>Verified</button>
            </form>

            <form class="form new-email" @submit.prevent="sendNewEmail">
                <SharedFormInput label="New Email" type="email" :placeholder="user.email" name="email" />

                <button v-if="!newStatus" class="submit" type="submit">Send verification</button>
                <button v-else-if="newStatus == 'waiting' && !newVerified" class="submit-waiting" type="submit" disabled>Awaiting verification</button>
                <button v-else-if="newVerified" class="submit-verified" type="submit" disabled>Verified</button>
            </form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.component {
    display: flex;
    flex-direction: column;

    height: 12rem;

    margin-bottom: 20px;

    background-color: $gray6;
}

.title {
    margin: 10px 0 2rem 18px;

    font-size: 1.25rem;
    font-weight: 700;
}

.forms {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 0 10px;
}

.form {
    max-width: 48%;
}

.submit {
    width: 100%;

    padding: 9px 0;

    border: none;

    font-size: 1rem;
    font-weight: 500;
    background-color: rgba($green, 0.1);
    color: $green;

    outline: none;

    &:hover {
        background-color: darken(rgba($green, 0.2), 4);
        cursor: pointer;
    }

    &-waiting {
        @extend .submit;

        background-color: rgba($green, 0.1);
        color: rgba($green, 0.5);

        &:hover {
            background-color: rgba($green, 0.1);
            color: rgba($green, 0.5);

            cursor: default
        }
    }

    &-verified {
        @extend .submit;

        background-color: rgba($blue, 0.2);
        color: rgba($blue, 1);

        &:hover {
            background-color: rgba($blue, 0.2);
            color: rgba($blue, 1);

            cursor: default
        }
    }
}
</style>

<script setup>
const oldStatus = ref()
const newStatus = ref()
const user = useState("user")

async function sendOldEmail(e) {
    oldStatus.value = "waiting"
    const { data, error } = await useFetch('/api/auth/reset-email/old', {
        method: "POST",
    })

    if (error.value)
        return oldStatus.value = null
}

async function sendNewEmail(e) {
    newStatus.value = "waiting"
    const { data, error } = await useFetch('/api/auth/reset-email/new', {
        method: "POST",
        body: {
            email: e.target.email.value
        }
    })

    if (error.value)
        return console.log(error.value.data)
}
</script>

<script>
export default {
    data() {
        return {
            oldVerified: null,
            newVerified: null
        }
    },
    mounted() {
        let socket = this.$nuxtSocket({
            name: 'main'
        })

        socket.emit('register', useCookie("token", {
            maxAge: 2592000,
            sameSite: 'lax'
        }).value)

        socket.on("oldVerified", () => {
            this.oldVerified = "verified"
        })

        socket.on("newVerified", () => {
            this.newVerified = "verified"
        })

        socket.on("confirmEmailChange", () => {
            console.log("supposed to refresh")
            window.location.reload(true)
        })
    }
}
</script>