<template>
    <div class="container">
        <div class="header">
            <h1 class="title">
                Live Chat
                <input type="hidden" id="activeServer-id" :value="activeServer._id" />
                <input type="hidden" id="activeServer-recentMessages" :value="JSON.stringify(activeServer.recentMessages)" />
            </h1>
        </div>

        <div class="msgs" id="msgs" v-html="msgs"></div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
    align-items: center;

    height: 50%;
    width: 100%;

    margin-bottom: $gap;

    background-color: $gray6;
}

.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
}

.title {
    width: fit-content;

    font-size: 1.25rem;
    font-weight: 700;


    margin: 10px 0 0 18px;
}

.msgs {
    height: 100%;
    width: 95%;

    margin: 20px auto;
    padding-left: 0.25em;

    overflow-y: scroll;
}

.msgs:deep(.msg) {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    margin-bottom: 7px;
}

.msgs:deep(.msg) .time {
    width: fit-content;

    margin-top: 4px;

    font-size: 0.7rem;
    color: $gray2;
}

.msgs:deep(.msg) .image {
    height: 12px;
    width: 12px;

    margin: 0 0.5rem;
    margin-top: 5px;
}

.msgs:deep(.msg) .content {
    margin: 0;
    padding-right: 15px;
}

.msgs:deep(.msg) .content .sender {
    display: inline;

    font-size: 0.75rem;
    font-weight: 700;
    color: white;
}

.msgs:deep(.msg) .content .text {
    display: inline;

    font-size: 0.75rem;
    font-weight: 400;
    color: $gray1;
}
</style>

<script setup>
const activeServer = useState('activeServer')
</script>

<script>
export default {
    data() {
        return {
            msgs: ""
        }
    },
    setup() {
        const activeServer = useState('')
        return activeServer
    },
    mounted() {
        let socket = this.$nuxtSocket({
            name: 'main'
        })

        socket.emit('register', useCookie("token", {
            maxAge: 2592000,
            sameSite: 'lax'
        }).value)

        for (var data of JSON.parse(document.getElementById('activeServer-recentMessages').value)) {
            this.msgs += `
            <div class="msg">
                <div class="time">19min</div>
                <img src="https://cravatar.eu/avatar/${data.sender}/16.png" class="image" />
                <p class="content">
                    <span class="sender">${data.sender}</span>
                    <span class="text">: ${data.msg}</span>
                </p>
            </div>
            `
        }

        this.scrollToBottom()

        socket.on('chatMsg', (data) => {
            if (document.getElementById('activeServer-id').value == data.server) {
                this.msgs += `
            <div class="msg">
                <div class="time">19min</div>
                <img src="https://cravatar.eu/avatar/DespacitoMaster/16.png" class="image" />
                <p class="content">
                    <span class="sender">${data.sender}</span>
                    <span class="text">: ${data.msg}</span>
                </p>
            </div>
            `
                this.scrollToBottom()
            } else {
                console.log(`wanted ${document.getElementById('activeServer-id').value} | received ${data.server}`)
            }
        })
    },
    methods: {
        scrollToBottom() {
            setTimeout(() => {
                document.getElementById('msgs').scrollTo({
                    top: document.getElementById('msgs').scrollHeight,
                    left: 0,
                    behavior: 'smooth'
                })
            }, 0)
        }
    }
}
</script>