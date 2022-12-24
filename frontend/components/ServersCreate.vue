<template>
    <div class="container">
        <div class="first-row">
            <SharedFormInput class="serverName" type="text" placeholder="Server Name" label="Server Name" name="serverName" />
            <SharedFormInput class="serverType" type="text" placeholder="Regular" label="Server Type" name="serverType" />
            <SharedFormInput class="bungeeCord" type="text" placeholder="None" label="BungeeCord Instance" name="bungeeCord" />
        </div>

        <div class="bottom-row">
            <SharedFormSlider type="text" placeholder="None" label="Storage Allocated" name="storage" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    width: 100%;

    padding: 25px;

    background-color: $gray6;
}

.first-row {
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
</style>