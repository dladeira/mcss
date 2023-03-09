<template>
    <div class="notif-container">
        <div :class="Date.now() - notif.time > lifetime ? 'notif-notif-' + notif.type + '-fading' : 'notif-notif-' + notif.type" v-for="notif of notifications">
            <div class="notif-text" v-html="notif.html"></div>
            <div class="notif-close" @click="removeNotif(notif.id)">+</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.notif-container {
    position: fixed;
    top: 1rem;
    left: 50%;
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
    align-items: center;

    width: fit-content;

    transform: translateX(-50%);
    z-index: 2;
}

.notif-notif {
    display: flex;
    flex-direction: flex-start;
    align-items: flex-end;

    height: fit-content;
    width: fit-content;

    margin-top: 1rem;
    padding: 0.4rem 1rem;

    border-radius: 1000px;

    font-size: 0.75rem;
    background-color: #626770;
    color: rgba(white, 0.8);

    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    transition: opacity 1s cubic-bezier(0.22, 0.61, 0.36, 1);

    &-blue {
        @extend .notif-notif;

        background-color: #0B5C7D;

        &-fading {
            @extend .notif-notif-blue;

            opacity: 0;
        }
    }

    &-green {
        @extend .notif-notif;

        background-color: #166944;

        &-fading {
            @extend .notif-notif-green;

            opacity: 0;
        }
    }

    &-red {
        @extend .notif-notif;

        background-color: #8C2933;

        &-fading {
            @extend .notif-notif-red;

            opacity: 0;
        }
    }

    &-white {
        @extend .notif-notif;

        background-color: #626770;

        &-fading {
            @extend .notif-notif-white;

            opacity: 0;
        }
    }
}

.notif-text:deep(.notif-bold) {
    font-weight: 700;
    color: white;
}

.notif-close {
    height: 0.8rem;
    width: 0.8rem;

    margin: 0 0 5px 1.5rem;

    font-size: 1.25rem;
    font-weight: 200;
    line-height: 1rem;
    color: white;

    transform: rotate(45deg);

    user-select: none;

    &:hover {
        cursor: pointer;
    }
}
</style>

<script setup>
const lifetime = 2000
const grayout = 500

const notifications = useState('notifications', () => [
    // {
    //     html: "Logged in as <span class='notif-bold'>dladeiratx@gmail.com</span>",
    // time: Date.now(),
    // id: Math.random(),
    // type: 'white'
    // }
])

if (process.client) {
    var id = setInterval(() => {
        notifications.value = notifications.value.filter(i => Date.now() - i.time < lifetime + grayout)
    }, 100)
}

function removeNotif(id) {
    notifications.value = notifications.value.filter(i => i.id != id)
}

onBeforeUnmount(() => {
    window.clearInterval(id)
})
</script>