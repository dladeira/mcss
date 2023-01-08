<template>
    <div class="wrapper" @click="clickOuter" v-if="popupPlayerCard">
        <div class="container" @click="clickInner">
            <div class="header">
                <img class="head" :src="`https://cravatar.eu/avatar/${player.username}/64.png`" />
                <div class="username">{{ popupPlayerCard.username }}</div>
            </div>
            <div class="body">
                More information to be added later
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100vh;
    width: 100vw;

    background-color: rgba(black, 0.2);
}

.container {
    padding: 1rem;

    border-radius: 10px;

    background-color: $gray6;
}

.header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    
    margin-bottom: 1rem;
    padding-bottom: 1rem;

    border-bottom: 2px solid #25365C;
}

.head {
    margin-right: 1rem;

    border-radius: 10px;
}

.username {
    font-size: 2rem;
}
</style>

<script>
export default {
    setup() {
        return {
            innerClick: ref(),
            popupPlayerCard: useState('popupPlayerCard'),
            player: useState('popupPlayerCard')
        }
    },
    methods: {
        clickInner() {
            this.innerClick = Date.now()
        },
        clickOuter() {
            if (!this.innerClick || Math.abs(Date.now() - this.innerClick) > 100) {
                this.popupPlayerCard = false
            }
        }
    }
}
</script>