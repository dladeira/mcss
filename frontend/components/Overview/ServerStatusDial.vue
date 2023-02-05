<template>
    <div :class="'wrapper ' + color">
        <canvas ref="canvas" :id="id" class="dial" />
        <div class="text">{{ percent }}</div>
    </div>
</template>

<style lang="scss" scoped>
$height: 7rem;
$width: 7rem;

.wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    height: $height;
    width: $width;
}

.blue {
    color: $blue;
}

.green {
    color: $green;
}

.red {
    color: $red;
}

.dial {
    position: absolute;

    height: $height;
    width: $width;
}

.text {
    font-size: 2rem;
    font-weight: 700;
}
</style>

<script setup>
const props = defineProps({
    id: String,
    percent: Number,
    color: String,
    hex: String
})

const scale = 2

function drawRadius(radius) {
    var canvas = document.getElementById(props.id)
    var ctx = canvas.getContext("2d")

    resizeCanvas(canvas)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    function drawWedge(ctx, x, y, radius, percent, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 10 * scale;

        ctx.translate(x, y);        // translate to rotating pivot
        ctx.rotate(Math.PI * 1);  // rotate, here 90° deg
        ctx.translate(-x, -y);      // translate back

        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.arc(x, y, radius, Math.PI / 2, Math.PI * (0.5 + (percent / 100 * 2)));
        ctx.stroke();

        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    }

    drawWedge(ctx, canvas.width / 2, canvas.height / 2, radius, 100, props.hex + "3f")
    drawWedge(ctx, canvas.width / 2, canvas.height / 2, radius, props.percent, props.hex)
}

function resizeCanvas(canvas) {
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // If it's resolution does not match change it
    if (canvas.width * scale !== width || canvas.height * scale !== height) {
        canvas.width = width * scale;
        canvas.height = height * scale;
        return true;
    }

    return false;
}

function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

onMounted(() => {
    setTimeout(() => {
        drawRadius(convertRemToPixels(3.1) * scale, props.percent)
    }, 30)
})
</script>