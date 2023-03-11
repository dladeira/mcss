<template>
    <section class="main">
        <h1 class="title">FAQ</h1>
        <h2 class="subtitle">Everything you need to know</h2>

        <div class="question" @mouseover="openDropdown(0)" @mouseleave="closeDropdowns()">
            <div class="header">
                <h1 class="question-title">Is this free?</h1>
                <div :class="dropdowns[0] ? 'dropdown-open' : 'dropdown-closed'"><nuxt-img src="/dropdown.svg" height="40" /></div>
            </div>

            <div :class="dropdowns[0] ? 'body-open' : 'body-closed'">
                As of right now MCSS is completely for <span class="body-green">free</span>. There are plans to monetize the service in the future, but right now all features are accessible at no cost.
            </div>
        </div>

        <div class="question" @mouseover="openDropdown(1)" @mouseleave="closeDropdowns()">
            <div class="header">
                <h1 class="question-title">What versions can I use?</h1>
                <div :class="dropdowns[1] ? 'dropdown-open' : 'dropdown-closed'"><nuxt-img src="/dropdown.svg" height="40" /></div>
            </div>

            <div :class="dropdowns[1] ? 'body-open' : 'body-closed'">
                All versions above <span class="body-green">1.13</span>. Support for versions below 1.13 is planned but currently not a priority.
            </div>
        </div>

        <div class="question" @mouseover="openDropdown(2)" @mouseleave="closeDropdowns()">
            <div class="header">
                <h1 class="question-title">What types of servers are supported?</h1>
                <div :class="dropdowns[2] ? 'dropdown-open' : 'dropdown-closed'"><nuxt-img src="/dropdown.svg" height="40" /></div>
            </div>

            <div :class="dropdowns[2] ? 'body-open' : 'body-closed'">
                MCSS can run on any <span class="body-green">CraftBukkit</span> server, including <span class="body-blue">Bukkit</span>, <span class="body-blue">Spigot</span>, and <span class="body-blue">Paper</span>.
            </div>
        </div>

        <div class="question" @mouseover="openDropdown(3)" @mouseleave="closeDropdowns()">
            <div class="header">
                <h1 class="question-title">What about BungeeCord?</h1>
                <div :class="dropdowns[3] ? 'dropdown-open' : 'dropdown-closed'"><nuxt-img src="/dropdown.svg" height="40" /></div>
            </div>

            <div :class="dropdowns[3] ? 'body-open' : 'body-closed'">
                BungeeCord is currently <span class="body-green">not supported</span>, but support is coming very soon.
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.main {
    height: 90vh;

    margin-top: 3rem;
    padding-top: 2rem;
}

.title {
    width: fit-content;


    margin: 0 auto;

    font-size: 3rem;
    font-weight: 700;
}

.subtitle {
    width: fit-content;

    margin: 1rem auto 5rem;

    font-size: 1.25rem;
    font-weight: 400;
    color: $gray1;
}

.question {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    width: 60%;

    margin: 0 auto 0.5rem;
    padding: 1.25rem 1.5rem;

    background-color: rgba(black, 0.2);

    &:hover {
        cursor: pointer;
    }
}

.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
}

.question-title {
    width: fit-content;
    margin: 0;

    font-size: 1.5rem;
    font-weight: 700;
    color: rgba(white, 0.5);
}

.dropdown {
    &-open {
        transition: all 400ms cubic-bezier(0.22, 0.61, 0.36, 1);

        transform: rotate(180deg) translateY(25%);
        opacity: 1;
    }

    &-closed {
        transition: all 400ms cubic-bezier(0.22, 0.61, 0.36, 1);
        opacity: 0.5;

    }
}

.body {
    width: 100%;
    padding-top: 1.5rem;

    transition: all 400ms cubic-bezier(0.22, 0.61, 0.36, 1);
    overflow: hidden;

    &-open {
        @extend .body;

        height: 6rem;
    }

    &-closed {
        @extend .body;

        height: 0;
        padding-top: 0;
    }

    &-green {
        font-weight: 700;
        color: $green;
    }

    &-blue {
        color: $blue;
    }
}

@keyframes fade-in {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>

<script setup>
const dropdowns = ref([false, false, false, false])

function openDropdown(index) {
    for (var i in dropdowns.value) {
        if (i == index)
            continue

        dropdowns.value[i] = false
    }

    dropdowns.value[index] = true
}

function closeDropdowns() {
    for (var i in dropdowns.value) {
        dropdowns.value[i] = false
    }
}
</script>