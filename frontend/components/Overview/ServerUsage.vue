<template>
    <div class="panel">
        <h1 class="panel-title">
            Server Usage (past 24h)
        </h1>

        <div class="chart">
            <Line :data="getData()" :options="options" />
        </div>

        <div class="labels">
            <div class="label">
                <div class="label-box" />
                <div class="label-text">CPU Usage</div>
            </div>
            <div class="label">
                <div class="label-box box-green" />
                <div class="label-text">RAM Usage</div>
            </div>
            <div class="label">
                <div class="label-box box-red" />
                <div class="label-text">Storage</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.panel {
    position: relative;

    grid-column: 3 / 4;
    grid-row: 1 / 3;

    border-radius: 5px;

    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.25);
}

.panel-title {
    margin: 1rem 0 0 1rem;

    font-size: 1rem;
    font-weight: 400;
}

.chart {
    height: 85%;
    width: 96%;

    margin: 1.5rem 0 0 1rem;
}

.labels {
    position: absolute;
    top: 15px;
    right: 0;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.label {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    margin-right: 1rem;
}

.label-box {
    height: 0.75rem;
    width: 0.75rem;

    border-radius: 5px;

    background-color: $blue;
}

.box-green {
    background-color: $green;
}

.box-red {
    background-color: $red;
}

.label-text {
    margin-left: 0.25rem;
    
    font-size: 0.75rem;
    font-weight: 400;
    color: rgba(white, 0.75);
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
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        x: {
            grid: {
                display: false,
            }
        },
        y: {
            grid: {
                display: false,
            },
            min: 0,
            max: 100
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

    for (var timeFrame of activeServer.value.stats.graphs[timeFrame]) {
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