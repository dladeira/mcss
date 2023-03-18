<template>
    <div class="component">
        <h1 class="panel-title">Support</h1>
        <div class="content">
                <div class="text">
                    For problems, suggestions, or inquiries, contact us at the following email address:
                </div>
                <div class="email">
                    mcss@ladeira.eu
                </div>
            </div>
    </div>
</template>

<style lang="scss" scoped>
.component {
    display: flex;
    flex-direction: column;

    height: fit-content;

    margin-bottom: 20px;

    background-color: $panel;
    border-radius: 5px;
}

.panel-title {
    margin: 1rem 0 1.5rem 1rem;

    font-size: 1rem;
    font-weight: 400;
}

.content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 1rem;
}

.text {
    margin-right: 50px;

    font-size: 0.75rem;
}

.email {
    padding: 0.5rem 1rem;

    border-radius: 10px;

    font-size: 0.75rem;

    border: 1px solid rgba(white, 0.5);
}
</style>