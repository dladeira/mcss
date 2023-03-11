<template>
    <form class="container" @submit.prevent="modifyServer">
        <div class="first-row">
            <SharedFormInput class="serverName" type="text" placeholder="Server Name" label="Server Name" name="serverName" :disabled="connecting" :value="server.name" />
            <SharedFormInput class="serverType" type="text" placeholder="Regular" label="Server Type" name="serverType" disabled />
            <SharedFormInput class="bungeeCord" type="text" placeholder="None" label="BungeeCord Instance" name="bungeeInstance" disabled />
        </div>

        <div class="bottom-row">
            <SharedFormSlider class="storage" label="Storage Allocated" name="storage" :value="server.storage" :min="Math.ceil(server.stats.storageUsed)" :max="user.plan.storage" :disabled="connecting" :step="1" />
            <SharedFormInput class="secret" type="text" label="Server Secret" :disabled="true" name="_id" :value="server._id" />
            <div class="submit-wrapper">

                <div class="error">{{ error }}</div>
                <button class="submit" type="submit" :disabled="connecting">Save Server</button>
                <button @click.prevent="deleteServer" class="delete" :disabled="connecting">Delete Server</button>
            </div>
        </div>
    </form>
</template>

<style lang="scss" scoped>
.container {
    width: 100%;

    padding: 25px;

    background-color: $gray6;
}

.first-row,
.bottom-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.serverName {
    width: 40%;
}

.serverType {
    width: 25%;
}

.bungeeCord {
    width: 30%;
}

.storage {
    width: 30%;
}

.secret {
    width: 30%;
}

.submit-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.error {
    margin-right: 1rem;

    font-size: 0.75rem;
    text-align: right;
    color: $red;
}

.submit {
    padding: 14px 26px;

    border: none;
    border-radius: 5px;
    outline: none;

    font-size: 0.75rem;
    font-weight: 400;
    background-color: rgba($green, 0.3);
    color: white;

    &:disabled {
        opacity: 0.5;

        &:hover {
            background-color: rgba($green, 0.3);
            cursor: default;
        }
    }

    &:hover {
        background-color: darken(rgba($green, 0.3), 5);
        cursor: pointer;
    }
}

.delete {
    @extend .submit;

    margin-left: 1rem;

    background-color: rgba($red, 0.3);
    color: white;

    &:disabled {
        opacity: 0.5;

        &:hover {
            background-color: rgba($red, 0.3);
            cursor: default;
        }
    }

    &:hover {
        background-color: darken(rgba($red, 0.3), 5);
        cursor: pointer;
    }
}
</style>

<script setup>
const user = useState('user')
const notifications = useState('notifications')
const config = useRuntimeConfig()

const props = defineProps({
    server: Object
})

const connecting = ref()
const error = ref()

async function deleteServer() {
    if (confirm("Are you sure you want to delete this server? There is no undo option.")) {
        await useFetch(config.public.origin + '/api/servers/delete', {
            method: "POST",
            body: {
                _id: props.server._id
            }
        })

        window.location.reload(true)
    }
}

async function modifyServer(e) {
    connecting.value = "true"
    const { data, error: fetchError } = await useFetch(config.public.origin + '/api/servers/update', {
        method: "POST",
        body: {
            serverName: e.target.serverName.value,
            serverType: e.target.serverType.value,
            bungeeInstance: e.target.bungeeInstance.value,
            storageAllocated: e.target.storage.value,
            _id: e.target._id.value
        }
    })

    if (fetchError.value) {
        connecting.value = null
        error.value = fetchError.value.data.error
        return
    }

    connecting.value = false

    error.value = null
    notifications.value.push({
        type: 'blue',
        time: Date.now(),
        id: Math.random(),
        html: `Saved settings for <span class='notif-bold'>${props.server.name}</span>`
    })
}
</script>