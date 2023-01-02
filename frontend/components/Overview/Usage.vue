<template>
    <div class="container">
        <div class="header">
            <h2 class="title">
                Server Usage
            </h2>

            <div class="selector">
                <div :class="selected == 'day' ? 'option-active' : 'option'" @click="selected = 'day'">
                    Day
                </div>
                <div :class="selected == 'month' ? 'option-active' : 'option'" @click="selected = 'month'">
                    Month
                </div>
                <div :class="selected == 'year' ? 'option-active' : 'option'" @click="selected = 'year'">
                    Year
                </div>
            </div>
        </div>
        <div class="chart">
            <Line :data="getData()" :options="options" />
        </div>
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

    margin-bottom: 1rem;

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

.selector {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    margin-top: 0.5rem;
}

.option {
    margin-right: 1.25rem;
    padding: 0.25rem;

    border-bottom: 1px solid $gray2;

    font-size: 0.75rem;
    color: $gray2;

    &:hover {
        cursor: pointer;
    }

    &-active {
        @extend .option;
        color: white;
        border-color: white;
    }
}

.chart {
    position: relative;
    height: 100%;
    width: 100%;

    padding: 1rem;
}
</style>

<script setup>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

const activeServer = useState('activeServer')
const selected = useState('selectedTime', () => "day")

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

let options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            grid: {
                display: false,
            },
            border: {
                color: 'rgba(255, 255, 255, 0.2)',
                width: 1
            },
            ticks: {
                font: {
                    size: 12
                },
                color: '#A3A3A3'
            }
        },
        y: {
            max: 100,
            min: 0,
            grid: {
                display: false,
            },
            border: {
                color: 'rgba(255, 255, 255, 0.2)',
                width: 1
            },
            ticks: {
                stepSize: 20,
                callback: function (value) {
                    return value + '%'
                },
                font: {
                    size: 12
                },
                color: '#A3A3A3'
            }
        }
    }
}

function getLabels() {
    var values = []
    switch (selected.value) {
        case "day":
            for (var i = 0; i < 24; i++) {
                values.push(i)
            }
            return values
        case "month":
            for (var i = 1; i <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); i++) {
                values.push(i)
            }
            return values
        case "year":
            values = ['Jan', 'Feb', 'Mar', 'Apr', 'Mar', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }

    return values
}

function getDataset(index, timeFrame) {
    const values = []

    // Timezone offset
    if (timeFrame == 'day')
        for (var i = 0; i < -Math.floor(new Date().getTimezoneOffset() / 60); i++) {
            values.push(undefined)
        }

    for (var timeFrame of activeServer.value.stats.cache.graphs[timeFrame]) {
        var value = timeFrame[index] / timeFrame.dataCount
        values.push(isNaN(value) && index != 'storage' || value == Infinity ? 0 : value)
    }

    return values
}

function getData() {
    return {
        labels: getLabels(),
        datasets: [
            {
                label: 'CPU Usage',
                backgroundColor: '#00C2FF',
                borderColor: "#00C2FF",
                data: getDataset('cpu', selected.value),
                fill: {
                    target: 'origin',
                    above: '#00C2FF44',   // Area will be red above the origin
                },
                lineTension: 0.1
            },
            {
                label: 'RAM Usage',
                backgroundColor: '#00FF75',
                borderColor: "#00FF75",
                data: getDataset('ram', selected.value),
                fill: {
                    target: 'origin',
                    above: '#00FF7544',   // Area will be red above the origin
                },
                lineTension: 0.1
            },
            {
                label: 'Storage Usage',
                backgroundColor: '#FF3030',
                borderColor: "#FF3030",
                data: getDataset('storage', selected.value),
                fill: {
                    target: 'origin',
                    above: '#FF303044',   // Area will be red above the origin
                },
                lineTension: 0.1,
                spanGaps: true
            }
        ]
    }
}
</script>