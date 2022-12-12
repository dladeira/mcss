<template>
    <section class="main">
        <h1 class="title">
            <span class="title-green">Pricing</span>
        </h1>
        <div class="plans">
            <div class="plan plan-free">
                <div class="plan-title">
                    Free
                </div>
                <div class="plan-price">
                    $0 / month
                </div>
                <div class="desc">
                    <div class="desc-point">
                        1 server slot
                    </div>
                    <div class="desc-point">
                    </div>
                    <div class="desc-point">
                        2GB storage
                    </div>
                    <div class="desc-point">
                        6 months server life
                    </div>
                    <div class="desc-point">
                        Server pinged every 1h
                    </div>
                </div>
                <div class="plan-button">
                    Register
                </div>
            </div>

            <div class="plan plan-premium">
                <div class="plan-title">
                    Premium
                </div>
                <div class="plan-price">
                    $5 / month
                </div>
                <div class="desc">
                    <div class="desc-point">
                        1 BungeeCord slot
                    </div>
                    <div class="desc-point">
                        5 server slots
                    </div>
                    <div class="desc-point">
                    </div>
                    <div class="desc-point">
                        10GB storage
                    </div>
                    <div class="desc-point">
                        Permanent storage life
                    </div>
                    <div class="desc-point">
                        Server pinged every 30min
                    </div>
                </div>
                <div class="plan-button">
                    Choose Plan
                </div>
            </div>

            <div class="plan plan-professional">
                <div class="plan-title">
                    Professional
                </div>
                <div class="plan-price">
                    $10 / month
                </div>
                <div class="desc">
                    <div class="desc-point">
                        3 BungeeCord slots
                    </div>
                    <div class="desc-point">
                        15 server slots
                    </div>
                    <div class="desc-point">
                    </div>
                    <div class="desc-point">
                        Infinite storage
                    </div>
                    <div class="desc-point">
                        Permanent storage life
                    </div>
                    <div class="desc-point">
                        Server pinged every 15min
                    </div>
                </div>
                <div class="plan-button">
                    Choose Plan
                </div>
            </div>
        </div>

        <div class="custom">
            <div class="custom-title">Custom</div>
            <div class="custom-price">$X / month</div>
            <div class="custom-description">None of these plans fit you?<br />Contact sales and we're work out a custom plan</div>
            <div class="custom-button">Contact Sales</div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.main {
    height: 100vh;

    padding-top: 20px;
}

.title {
    margin: 3rem 0 4rem 0;

    font-size: 3rem;
    font-weight: 700;

    &-blue {
        color: $blue;
    }

    &-green {
        color: $green;
    }
}

.plans {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.plan {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    width: 30%;

    padding: 30px 0;

    border-radius: 10px;

    background-color: rgba(#1F2940, 0.6);

    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25);

    &-free {
        border-top: 10px rgba(255, 255, 255, 0.5) solid;
    }

    &-premium {
        border-top: 10px rgba($blue, 0.5) solid;
    }

    &-professional {
        border-top: 10px rgba($red, 0.5) solid;
    }
}

.plan-title {
    margin-bottom: 2rem;

    font-size: 2rem;
    font-weight: 700;
}
</style>