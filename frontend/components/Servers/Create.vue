<template>
    <div class="wrapper" v-if="popupCreateServer" @click="clickOuter()">
        <form class="container" @submit.prevent="createServer" @click="clickInner()">
            <div class="header">
                <h1 class="title">Create Server</h1>
                <div class="exit" @click="clickOuter()">+</div>
            </div>
            <div class="tabs">
                <h2 class="tab1" :class="currentSec == 'sec1' ? 'tab-active' : 'tab'">1. Basic Information</h2>
                <h2 class="tab2" :class="currentSec == 'sec2' ? 'tab-active' : 'tab'">2. BungeeCord Setup</h2>
                <h2 class="tab3" :class="currentSec == 'sec3' ? 'tab-active' : 'tab'">3. Plugin Setup</h2>
            </div>
            <div class="sec sec1" v-if="currentSec == 'sec1'">
                <div class="first-column">
                    <SharedFormInput class="serverName" type="text" placeholder="Server Name" label="Server Name" name="serverName" :disabled="connecting" />
                    <SharedFormInput class="serverType" type="text" placeholder="Regular" label="Server Type" name="serverType" disabled />
                    <SharedFormSlider class="storage" type="text" placeholder="None" label="Storage Allocated" name="storage" :min="0" :max="user.plan.storage" :disabled="connecting" />
                </div>

                <div class="bottom">
                    <button class="continue" type="submit">Continue</button>
                    <div class="error">{{ error }}</div>
                </div>
            </div>
            <div class="sec sec2" v-if="currentSec == 'sec2'">
                <SharedFormInput class="bungeeCord" type="text" placeholder="None" label="BungeeCord Instance" name="bungeeInstance" disabled />
            </div>
            <div class="sec sec3" v-if="currentSec == 'sec3'">
                <ol class="instructions">
                    <li>Download the MCSS plugin (v1.0.0) from <a href="/releases/mcss-1.0.0.jar" class="download">here</a></li>
                    <li>Move the plugin file inside the <b>/plugins</b> server folder</li>
                    <li>Restart the server</li>
                    <li>Type the following command in chat:</li>
                </ol>

                <div class="command">
                    /register <span class="secret">{{ secret }}</span>
                </div>

                <div class="bottom">
                    <button class="confirm" :disabled="!serverConfirmed" @click="finish()">Confirm Server Creation</button>
                    <div class="status-waiting" v-if="!serverConfirmed">Waiting for server...</div>
                    <div class="status" v-else>Server created!</div>
                </div>
            </div>

        </form>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    position: fixed;
    top: 0;
    left: 0;

    height: 100vh;
    width: 100vw;

    background-color: rgba(black, 0.5);

    z-index: 2;
}

.container {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    height: 28rem;
    width: 38rem;

    padding: 1rem 1.2rem;

    border-radius: 5px;

    background-color: $gray6;
}

.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    width: 100%;

    margin-bottom: 2rem;
}

.title {
    margin: 0;

    font-size: 1.5rem;
    font-weight: 700;

    cursor: default;
}

.exit {
    height: 1rem;
    width: 1rem;

    margin: 0;

    font-size: 2.25rem;
    font-weight: 300;
    line-height: 1rem;

    transform: rotate(45deg);

    user-select: none;

    &:hover {
        cursor: pointer;
    }
}

.tabs {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    margin-bottom: 2rem;

    cursor: default;
}

.tab {
    width: 31%;

    margin: 0;
    padding-bottom: 0.75rem;

    border-bottom: 1px solid #434956;

    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    color: #434956;

    &-active {
        @extend .tab;

        border-color: white;
        color: white;
    }
}

.sec {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    height: 100%;
}

.first-column {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    width: fit-content;
}

.first-row .serverName {
    width: 20rem;
}

.serverType {
    width: 12rem;
}

.storage {
    width: 20rem;
}

.bottom {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-top: auto;
}

.continue {
    padding: 14px 40px;

    border: none;
    border-radius: 5px;
    outline: none;

    font-size: 0.8rem;
    font-weight: 500;
    background-color: rgba($blue, 0.2);
    color: $blue;

    &:hover {
        background-color: darken(rgba($blue, 0.2), 5);
        cursor: pointer;
    }
}

.error {
    margin: 0 0 0.25rem 1.5rem;

    font-size: 0.75rem;
    color: $red;
}

.instructions {
    font-size: 1rem;
    font-weight: 400;
    line-height: 2rem;

    margin: 0 0 0.75rem;
    padding-left: 1.5rem;
}

.download {
    font-weight: 700;
    color: $blue;
}

.command {
    padding: 0.75rem 1.25rem;

    border-radius: 5px;

    font-weight: 700;
    background-color: rgba(black, 0.3);
    color: white;
}

.secret {
    color: $gold;
}

.confirm {
    @extend .continue;

    background-color: rgba($green, 0.2);
    color: $green;

    &:hover {
        background-color: darken(rgba($green, 0.2), 5);
    }

    &:disabled {
        opacity: 0.5;

        &:hover {
            background-color: rgba($green, 0.2);
            cursor: default;
        }
    }
}

.status {
    @extend .error;

    color: white;

    &-waiting {
        @extend .status;

        font-style: italic;
    }
}
</style>

<script>
export default {
    setup() {
        return {
            user: useState('user'),
            connecting: ref(),
            error: ref(),
            innerClick: ref(),
            config: useRuntimeConfig(),
            popupCreateServer: useState('popupCreateServer'),
            currentSec: ref('sec1'),
            secret: ref(),
            activeServer: useState('activeServer'),
            serverConfirmed: ref()
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

        socket.on('serverVerified', (receivedSecret) => {
            if (this.secret == receivedSecret)
                this.serverConfirmed = true
        })
    },
    methods: {
        clickInner() {
            this.innerClick = Date.now()
        },
        clickOuter() {
            if (!this.innerClick || Math.abs(Date.now() - this.innerClick) > 100) {
                this.popupCreateServer = false
            }
        },

        async createServer(e) {
            this.connecting = "true"
            const { data, error: fetchError } = await useFetch(this.config.public.origin + '/api/servers/new', {
                method: "POST",
                body: {
                    serverName: e.target.serverName.value,
                    serverType: e.target.serverType.value,
                    storageAllocated: e.target.storage.value
                }
            })

            if (fetchError.value) {
                this.connecting = null
                this.error = fetchError.value.data.error
                return
            }

            this.error = null
            this.currentSec = 'sec3'
            this.secret = data.value.secret
        },
        finish() {
            location.reload(true)
        }
    }
}
</script>