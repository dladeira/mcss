<template>
    <NuxtLayout name="server">

        <Head>
            <Title>{{ activeServer.name }} - Statistics</Title>
        </Head>

        <div class="grid">
            <div class="panel statisticsViewer">
                <h1 class="panel-title">Statistics Viewer</h1>
                <div class="chart">
                    <Line :data="getData()" :options="options" />
                </div>
            </div>
            <div class="panel xAxis">
                <h1 class="axis-title">X Axis</h1>

                <div class="selections">
                    <div class="selection-group">
                        <div :class="selected == 'day' ? 'selection-regular-selected' : 'selection-regular'" @click="selected = 'day'">Day</div>
                        <div :class="selected == 'month' ? 'selection-regular-selected' : 'selection-regular'" @click="selected = 'month'">Month</div>
                        <div :class="selected == 'year' ? 'selection-regular-selected' : 'selection-regular'" @click="selected = 'year'">Year</div>
                    </div>
                    <div class="selection-group">
                        <div :class="selected == 'average' ? 'selection-average-selected' : 'selection-average'" @click="selected = 'average'">Average Day</div>
                        <div :class="selected == 'peak' ? 'selection-peak-selected' : 'selection-peak'" @click="selected = 'peak'">Peak Day</div>
                    </div>
                </div>
            </div>
            <div class="panel yAxis">
                <h1 class="axis-title">Y Axis</h1>
                <div class="options">
                    <div class="option-column">
                        <div class="option" @click="toggleYSelected('cpu')">
                            <div :class="isYSelected('cpu') ? 'option-button-selected' : 'option-button'" />
                            <div class="option-text">
                                CPU Usage
                            </div>
                        </div>
                        <div class="option" @click="toggleYSelected('ram')">
                            <div :class="isYSelected('ram') ? 'option-button-selected' : 'option-button'" />
                            <div class="option-text">
                                RAM Usage
                            </div>
                        </div>
                        <div class="option" @click="toggleYSelected('storage')">
                            <div :class="isYSelected('storage') ? 'option-button-selected' : 'option-button'" />
                            <div class="option-text">
                                Storage Usage
                            </div>
                        </div>
                        <div class="option" @click="toggleYSelected('players')">
                            <div :class="isYSelected('players') ? 'option-button-selected' : 'option-button'" />
                            <div class="option-text">
                                Player Count
                            </div>
                        </div>
                    </div>
                    <div class="option-column">
                        <div class="option" @click="toggleYSelected('messages')">
                            <div :class="isYSelected('messages') ? 'option-button-selected' : 'option-button'" />
                            <div class="option-text">
                                Messages sent
                            </div>
                        </div>
                        <div class="option" @click="toggleYSelected('characters')">
                            <div :class="isYSelected('characters') ? 'option-button-selected' : 'option-button'" />
                            <div class="option-text">
                                Characters sent
                            </div>
                        </div>
                        <div class="option" @click="toggleYSelected('whispers')">
                            <div :class="isYSelected('whispers') ? 'option-button-selected' : 'option-button'" />
                            <div class="option-text">
                                Whispers sent
                            </div>
                        </div>
                        <div class="option" @click="toggleYSelected('commands')">
                            <div :class="isYSelected('commands') ? 'option-button-selected' : 'option-button'" />
                            <div class="option-text">
                                Commands sent
                            </div>
                        </div>
                    </div>
                    <div class="option-column">
                        <div class="option" @click="toggleYSelected('blocksBrokenPerPlayer')">
                            <div :class="isYSelected('blocksBrokenPerPlayer') ? 'option-button-selected' : 'option-button'" />
                            <div class="option-text">
                                Blocks broken/player
                            </div>
                        </div>
                        <div class="option" @click="toggleYSelected('blocksPlacedPerPlayer')">
                            <div :class="isYSelected('blocksPlacedPerPlayer') ? 'option-button-selected' : 'option-button'" />
                            <div class="option-text">
                                Blocks placed/player
                            </div>
                        </div>
                        <div class="option" @click="toggleYSelected('blocksTraveledPerPlayer')">
                            <div :class="isYSelected('blocksTraveledPerPlayer') ? 'option-button-selected' : 'option-button'" />
                            <div class="option-text">
                                Blocks traveled/player
                            </div>
                        </div>
                        <div class="option" @click="toggleYSelected('itemsCraftedPerPlayer')">
                            <div :class="isYSelected('itemsCraftedPerPlayer') ? 'option-button-selected' : 'option-button'" />
                            <div class="option-text">
                                Items Crafted/player
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<style lang="scss" scoped>
.grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: minmax(0, 75fr) minmax(0, 25fr);
    grid-gap: 1.25rem;

    height: calc(100vh - 90px);

    padding: 2rem 0;
}

.statisticsViewer {
    grid-column: 1 / 3;
}

.panel {
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    height: 100%;
    width: 100%;

    border-radius: 5px;

    background-color: $panel;

    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.25);
}

.panel-title {
    margin: 1rem 0 0 1rem;

    font-size: 1rem;
    font-weight: 400;
}

.chart {
    height: 87%;
    width: 98%;

    margin: 1.5rem 0 0 1rem;
}

.axis {
    height: 100%;
    width: 50%;

    margin-right: 1.5rem;

    border-top: #D9D9D9 solid 2px;
    border-radius: 0 0 10px 10px;

    background-color: rgba(#131928, 0.8);

    &:last-child {
        margin-right: 0;
    }
}

.axis-title {
    width: fit-content;

    margin: 1rem auto 1.5rem;

    font-size: 1.5rem;
}

.selections {
    width: 100%;
}

.selection-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 90%;

    margin: 0 auto 0.75rem;
}

.selection {
    width: 32%;

    padding: 0.65rem 0;

    border-radius: 5px;

    text-align: center;
    font-size: 0.75rem;
    color: white;

    &:hover {
        cursor: pointer;
    }

    $regular: 0.3;
    $hover: 0.4;
    $selected: 0.6;

    &-regular {
        @extend .selection;

        background-color: rgba($green, $regular);

        &:hover {
            background-color: rgba($green, $hover);
        }

        &-selected {
            @extend .selection;

            background-color: rgba($green, $selected);
        }
    }

    &-average {
        @extend .selection;

        width: 49%;

        background-color: rgba($red, $regular);

        &:hover {
            background-color: rgba($red, $hover);
        }

        &-selected {
            @extend .selection;

            width: 49%;

            background-color: rgba($red, $selected);
        }
    }

    &-peak {
        @extend .selection;

        width: 49%;

        background-color: rgba($blue, $regular);

        &:hover {
            background-color: rgba($blue, $hover);
        }

        &-selected {
            @extend .selection;

            width: 49%;

            background-color: rgba($blue, $selected);
        }
    }
}

.options {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: calc(100% - 3rem);

    margin: 0 1.5rem;
}

.option {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    margin-bottom: 0.5rem;

    font-size: 0.75rem;

    &:hover {
        cursor: pointer;
    }
}

.option-button {
    height: 1rem;
    width: 1rem;

    margin-right: 0.5rem;

    border-radius: 5px;

    background-color: rgba(#d9d9d9, 0.3);

    &:hover {
        background-color: rgba(#d9d9d9, 0.5);
    }

    &-selected {
        @extend .option-button;

        background-color: white;

        &:hover {
            background-color: rgba(white, 0.8);
        }
    }
}
</style>

<script setup>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title as TitleChartJS,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TitleChartJS,
    Tooltip,
    Legend,
    Filler
)

const activeServer = useState('activeServer')
const selected = useState('selectedTime', () => "day")
const ySelected = useState('yAxis-selected', () => [])


function toggleYSelected(index) {
    if (ySelected.value.indexOf(index) == -1) {
        ySelected.value.push(index)
    } else {
        ySelected.value = ySelected.value.filter(i => i != index)
    }
}

function isYSelected(index) {
    return ySelected.value.indexOf(index) != -1
}

function yIndexToText(index) {
    switch (index) {
        case 'cpu':
            return 'CPU Usage'
        case 'ram':
            return 'Ram Usage'
        case 'storage':
            return 'Storage Usage'
        case 'players':
            return 'Player Count'
        case 'messages':
            return 'Messages'
        case 'characters':
            return 'Characters'
        case 'whispers':
            return 'Whispers'
        case 'commands':
            return 'Commands'
        case 'blocksBrokenPerPlayer':
            return 'Blocks broken/player'
        case 'blocksPlacedPerPlayer':
            return 'Blocks placed/player'
        case 'blocksTraveledPerPlayer':
            return 'Blocks Traveled/player'
        case 'itemsCraftedPerPlayer':
            return 'Items Crafted/player'
    }
}

function getColor(index) {
    switch (index) {
        case 0:
            return '#00C2FF'
        case 1:
            return '#00FF75'
        case 2:
            return '#FF3030'
        case 3:
            return '#FFC700'
        default:
            return '#FFFFFF'
    }
}

function getDatasets() {
    const datasets = []
    var index = 0
    for (var y of ySelected.value) {
        datasets.push({
            label: yIndexToText(y),
            backgroundColor: getColor(index),
            borderColor: getColor(index),
            data: getDataset(y, selected.value),
            fill: {
                target: 'origin',
                above: getColor(index) + '44'
            },
            lineTension: 0.1
        })

        index++
    }

    return datasets
}

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
            min: 0,
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
        case "peak":
            for (var i = 0; i < 24; i++) {
                values.push(i)
            }
            return values
        case "average":
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
    var timeline = activeServer.value.stats.timeline
    const values = []
    const date = new Date()

    switch (timeFrame) {
        case 'day':
            for (var i = 0; i <= 23; i++) {
                var timestamp = timeline.find(timestamp => {
                    const timelineDate = new Date(timestamp.time)
                    return timelineDate.getDate() == date.getDate() && timelineDate.getMonth() == date.getMonth() && timelineDate.getFullYear() == date.getFullYear() && timelineDate.getHours() == i
                })

                values.push(timestamp ? timestamp.stats.dataCount == 0 ? 0 : timestamp.stats[index] / timestamp.stats.dataCount : 0)
            }
            break;
        case 'month':
            for (var i = 0; i <= new Date(parseInt(date.getFullYear()), date.getMonth() + 1, 0).getDate(); i++) {
                var timestamps = timeline.filter(timestamp => {
                    const timelineDate = new Date(timestamp.time)
                    return timelineDate.getDate() == i && timelineDate.getMonth() == date.getMonth() && timelineDate.getFullYear() == date.getFullYear()
                })

                var dataCount = timestamps.reduce((acc, cur) => acc + cur.stats.dataCount, 0)
                var value = timestamps.reduce((acc, cur) => acc + cur.stats[index], 0)
                values.push(timestamps.length > 0 ? dataCount == 0 ? 0 : value / dataCount : 0)
            }
            break;
        case 'year':
            for (var i = 0; i < 12; i++) {
                var timestamps = timeline.filter(timestamp => {
                    const timelineDate = new Date(timestamp.time)
                    return timelineDate.getMonth() == i && timelineDate.getFullYear() == date.getFullYear()
                })

                var dataCount = timestamps.reduce((acc, cur) => acc + cur.stats.dataCount, 0)
                var value = timestamps.reduce((acc, cur) => acc + cur.stats[index], 0)
                values.push(timestamps.length > 0 ? dataCount == 0 ? 0 : value / dataCount : 0)
            }
            break;
        case 'average':
            for (var i = 0; i <= 23; i++) {
                var timestamps = timeline.filter(timestamp => {
                    const timelineDate = new Date(timestamp.time)
                    return timelineDate.getHours() == i
                })

                var dataCount = timestamps.reduce((acc, cur) => acc + cur.stats.dataCount, 0)
                var value = timestamps.reduce((acc, cur) => acc + cur.stats[index], 0)
                values.push(timestamps.length > 0 ? dataCount == 0 ? 0 : value / dataCount : 0)
            }
            break;
        case 'peak':
            for (var i = 0; i <= 23; i++) {
                var timestamps = timeline.filter(timestamp => {
                    const timelineDate = new Date(timestamp.time)
                    const peakDate = new Date(activeServer.value.stats.peakTime)
                    return timelineDate.getHours() == i && timelineDate.getMonth() == peakDate.getUTCMonth() && timelineDate.getFullYear() == peakDate.getUTCFullYear() && timelineDate.getDate() == peakDate.getDate()
                })

                var dataCount = timestamps.reduce((acc, cur) => acc + cur.stats.dataCount, 0)
                var value = timestamps.reduce((acc, cur) => acc + cur.stats[index], 0)
                values.push(timestamps.length > 0 ? dataCount == 0 ? 0 : value / dataCount : 0)
            }
            break;
    }

    return values
}

function getData() {
    return {
        labels: getLabels(),
        datasets: getDatasets()
    }
}

definePageMeta({
    pageTransition: {
        name: 'blur'
    },
    layout: 'user'
})
</script>