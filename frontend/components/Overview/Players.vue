<template>
    <div class="panel">
        <h1 class="panel-title">
            Players (past 24h)
        </h1>

        <div class="chart">
            <Line :data="getData()" :options="options" />
        </div>

        <div class="labels">
            <div class="label">
                <div class="label-box" />
                <div class="label-text">Players</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.panel {
    position: relative;

    grid-column: 1 / 4;
    grid-row: 3 / 4;

    border-radius: 5px;

    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.25);
}

.panel-title {
    margin: 1rem 0 0 1rem;

    font-size: 1rem;
    font-weight: 400;
}

.chart {
    height: 77%;
    width: 98%;

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

    background-color: $gold;
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
            min: 0
        }
    }
}

function getLabels() {
    var values = []
    switch ("day") {
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

function getDataset(index) {
    const values = []

    for (var i = 0; i <= 23; i++) {
        var timeline = activeServer.value.stats.timeline
        const date = new Date()

        var timestamp = timeline.find(timestamp => {
            const timelineDate = new Date(timestamp.time)
            return timelineDate.getDate() == date.getDate() && timelineDate.getMonth() == date.getMonth() && timelineDate.getFullYear() == date.getFullYear() && timelineDate.getHours() == i
        })

        values.push(timestamp ? timestamp.stats.dataCount == 0 ? 0 : timestamp.stats[index] / timestamp.stats.dataCount : 0)
    }

    return values
}

function getData() {
    return {
        labels: getLabels(),
        datasets: [
            {
                label: 'Players',
                backgroundColor: '#FFD600',
                borderColor: "#FFD600",
                data: getDataset('players'),
                fill: {
                    target: 'origin',
                    above: '#FFD6003F',
                },
                lineTension: 0.1
            },
        ]
    }
}
</script>