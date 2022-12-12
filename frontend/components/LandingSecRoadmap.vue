<template>
    <section class="main">
        <h1 class="title">
            <span class="title-green">Future Roadmap</span>
        </h1>
        <div class="plans">
            <div class="plan">
                <div class="release">Expected release <span class="release-date">January 1st</span></div>
                <div class="plan-title">Launch</div>

                <div class="desc">
                    <div class="text">The initial launch of the service with only it's key features.</div>
                    <div class="points">
                        <div class="point">- Control panel <span class="point-bold">v1.0</span></div>
                        <div class="point">- Server panel <span class="point-bold">v1.0</span></div>
                        <div class="point">- Support for <span class="point-bold">100 servers</span></div>
                        <div class="point">- <span class="point-bold">Free </span> service</div>
                    </div>
                </div>
            </div>

            <div class="plan plan-green">
                <div class="release">Expected release <span class="release-date">February 1st</span></div>
                <div class="plan-title title-green">Admin Update</div>

                <div class="desc">
                    <div class="text">Support for large scale networks and servers including admin tools.</div>
                    <div class="points">
                        <div class="point">- Server panel <span class="point-bold">v3.0</span></div>
                        <div class="point">- <span class="point-bold">BungeeCord</span> support</div>
                        <div class="point">- Multiple <span class="point-bold">owners</span></div>
                        <div class="point"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="plans">
            <div class="plan plan-blue">
                <div class="release">Expected release <span class="release-date">March 1st</span></div>
                <div class="plan-title title-blue">Data Update</div>

                <div class="desc">
                    <div class="text">Provide more practical information to server owners and suggest changes.</div>
                    <div class="points">
                        <div class="point">- Control panel <span class="point-bold">v2.0</span></div>
                        <div class="point">- GeoMap <span class="point-bold">v1.0</span></div>
                        <div class="point">- Server suggestions <span class="point-bold">v1.0</span></div>
                        <div class="point">- Surveys <span class="point-bold">v1.0</span></div>
                    </div>
                </div>
            </div>

            <div class="plan plan-red">
                <div class="release">Expected release <span class="release-date">June 1st</span></div>
                <div class="plan-title title-red">Product Publish</div>

                <div class="desc">
                    <div class="text">Final product release to the public. Implement QOLs and fix all known bugs.</div>
                    <div class="points">
                        <div class="point">- <span class="point-bold">Pricing</span> & plans</div>
                        <div class="point">- <span class="point-bold">Customer</span> support</div>
                        <div class="point">- Ads and<span class="point-bold">branding</span></div>
                        <div class="point">Support <span class="point-bold">200</span> servers</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.main {
    height: 100vh;

    padding-top: 20px;
}

.title {
    margin: 2rem 0 5rem 0;

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

    margin-bottom: 3rem;
}

.plan {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    width: 47%;

    border-top: 10px solid rgba(white, 0.5);
    border-radius: 10px;

    background-color: #1B273D;

    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25);

    &-green {
        border-top-color: rgba($green, 0.5);
    }

    &-blue {
        border-top-color: rgba($blue, 0.5)
    }

    &-red {
        border-top-color: rgba($red, 0.5);
    }
}

.release {
    margin-top: 1rem;
    color: $gray1;

    &-date {
        color: white;
    }
}

.plan-title {
    margin-top: 1rem;
    margin-bottom: 1em;

    font-size: 2rem;
    font-weight: 700;
    color: white;
}

.title-green {
    color: $green;
}

.title-blue {
    color: $blue;
}

.title-red {
    color: $red;
}

.desc {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    padding: 0 2rem;
    padding-bottom: 30px;
}

.text {
    width: calc(40% + 1rem);

    font-weight: 200;
    line-height: 2rem;
}

.point {
    min-height: 2rem;

    font-weight: 400;
    line-height: 2rem;

    &-bold {
        font-weight: 700;
    }
}
</style>