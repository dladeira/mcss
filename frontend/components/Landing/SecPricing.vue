<template>
    <section class="main" id="pricing">
        <h1 class="title">
            <span class="title-green">Pricing</span>
        </h1>
        <div class="plans">
            <div class="plan sec-pricing-plan1 plan-free">
                <div class="plan-title">
                    Free
                </div>
                <div class="plan-price">
                    $0 / month
                </div>
                <div class="desc">
                    <div class="desc-point">
                        - <span class="desc-bold">1</span> server slot
                    </div>
                    <div class="desc-point" />
                    <div class="desc-point" />
                    <div class="desc-point">
                        - <span class="desc-bold">2GB</span> storage
                    </div>
                    <div class="desc-point">
                        - <span class="desc-bold">3 months</span> storage life
                    </div>
                    <div class="desc-point">
                        - Server pinged every <span class="desc-bold">1h</span>
                    </div>
                </div>
                <nuxt-link class="plan-button" to="login">
                    Register
                </nuxt-link>
            </div>

            <div class="plan sec-pricing-plan1 plan-premium">
                <div class="plan-title title-blue">
                    Premium
                </div>
                <div class="plan-price">
                    $5 / month
                </div>
                <div class="desc">
                    <div class="desc-point">
                        - <span class="desc-bold">1</span> BungeeCord slot
                    </div>
                    <div class="desc-point">
                        - <span class="desc-bold">5</span> server slots
                    </div>
                    <div class="desc-point">
                    </div>
                    <div class="desc-point">
                        - <span class="desc-bold">10GB</span> storage
                    </div>
                    <div class="desc-point">
                        - <span class="desc-bold">Permanent</span> storage life
                    </div>
                    <div class="desc-point">
                        - Server pinged every <span class="desc-bold">30min</span>
                    </div>
                </div>
                <div class="plan-button button-blue not-released">
                    Coming Soon
                </div>
            </div>

            <div class="plan sec-pricing-plan1 plan-professional">
                <div class="plan-title title-red">
                    Professional
                </div>
                <div class="plan-price">
                    $10 / month
                </div>
                <div class="desc">
                    <div class="desc-point">
                        - <span class="desc-bold">3</span> BungeeCord slots
                    </div>
                    <div class="desc-point">
                        - <span class="desc-bold">15</span> server slots
                    </div>
                    <div class="desc-point">
                    </div>
                    <div class="desc-point">
                        - <span class="desc-bold">Infinite</span> storage
                    </div>
                    <div class="desc-point">
                        - <span class="desc-bold">Permanent</span> storage life
                    </div>
                    <div class="desc-point">
                        - Server pinged every <span class="desc-bold">15min</span>
                    </div>
                </div>
                <div class="plan-button button-red not-released">
                    Coming Soon
                </div>
            </div>
        </div>

        <div class="custom sec-pricing-plan2">
            <div class="custom-title">Custom</div>
            <div class="custom-price">$X / month</div>
            <div class="custom-description">None of these plans fit you?<br />Contact sales and we're work out a custom
                plan</div>
            <div class="custom-button not-released">Coming Soon</div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.main {
    height: 110vh;
    min-height: 900px;

    padding-top: 2rem;
}

.title {
    margin: 0;
    margin-bottom: 5rem;

    font-size: 3rem;
    font-weight: 700;

    &-blue {
        color: $blue;
    }

    &-green {
        color: $green;
    }
}

.title-blue {
    color: $blue;
}

.title-red {
    color: $red;
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

    width: 30%;
    max-width: 350px;

    padding: 30px 0;

    border-radius: 10px;

    background-color: rgba(#1F2940, 0.6);

    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25);
    opacity: 0;
    transition: opacity 2s cubic-bezier(0.22, 0.61, 0.36, 1);

    &-animated {
        opacity: 1;
    }

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
    margin: 0;
    margin-bottom: 1.5rem;

    font-size: 2.25rem;
    font-weight: 700;
}

.plan-price {
    margin: 0;
    margin-bottom: 1.5rem;

    font-size: 1.25rem;
    font-weight: 700;
}

.desc {
    height: 280px;
    width: 100%;

    margin-left: 100px;

    &-point {
        margin: 10px 0;

        min-height: 1.5rem;

        font-size: 1rem;
        font-weight: 300;
        line-height: 1.5em;
    }

    &-bold {
        font-weight: 700;
    }
}

.plan-button {
    padding: 16px 58px;

    border-radius: 10px;

    text-align: center;
    text-decoration: none;
    background-color: rgba(#ffffff, 0.1);
    color: #ffffff;
}

.button-blue {
    // background-color: rgba($blue, 0.1);
    background-color: transparent;
    color: $blue;
}

.button-red {
    // background-color: rgba($red, 0.1);
    background-color: transparent;
    color: $red;
}

.custom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 20px 40px;

    border-left: 10px solid rgba($green, 0.5);
    border-radius: 10px;

    background-color: rgba(#1F2940, 0.6);

    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25);
    opacity: 0;
    transition: opacity 2s cubic-bezier(0.22, 0.61, 0.36, 1);

    &-animated {
        opacity: 1;
    }
}

.custom-title {
    font-size: 2rem;
    font-weight: 700;
    color: $green;
}

.custom-price {
    font-size: 1rem;
    font-weight: 700;
}

.custom-description {
    line-height: 200%;
}

.custom-button {
    padding: 1rem 2rem;

    border-radius: 10px;

    text-decoration: none;
    // background-color: rgba($green, 0.1);
    color: $green;
}

.not-released {
    &:hover {
        cursor: not-allowed;
    }
}
</style>

<script setup>
onMounted(() => {
    document.addEventListener('scroll', function () {
        if (isInViewport(document.getElementsByClassName("sec-pricing-plan1")[0])) {
            for (var panel of document.getElementsByClassName("sec-pricing-plan1"))
                if (!panel.classList.contains("plan-animated"))
                    panel.classList.add("plan-animated")
        }

        if (isInViewport(document.getElementsByClassName("sec-pricing-plan2")[0])) {
            for (var panel of document.getElementsByClassName("sec-pricing-plan2"))
                if (!panel.classList.contains("custom-animated"))
                    panel.classList.add("custom-animated")
        }
    }, {
        passive: true
    })
})

/* source: https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/#:~:text=Use%20the%20getBoundingClientRect()%20method%20to%20get%20the%20size%20of,in%20the%20viewport%20or%20not. */
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)

    );
}
</script>