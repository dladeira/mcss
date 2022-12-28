<template>
    <div class="container">
        <div class="section">
            <h1 class="title">
                {{ name }}
            </h1>
            <p class="time">
                {{ _id }}
            </p>

            <div class="tags">
                <div class="tag tag-status">
                    Online
                </div>
                <div class="tag tag-level">
                    Level 1 - Server
                </div>
            </div>

            <div class="dials">
                <div class="dial">
                    <h3 class="dial-title">
                        CPU
                    </h3>

                    <div class="dial-outer">
                        <div class="dial-inner cpu-inner">
                            <div class="usage">
                                {{ stats.live.cpuUsage }}%
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dial">
                    <h3 class="dial-title">
                        RAM
                    </h3>

                    <div class="dial-outer">
                        <div class="dial-inner ram-inner">
                            <div class="usage">
                                {{ stats.live.ramUsage }}%
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dial">
                    <h3 class="dial-title">
                        Storage
                    </h3>

                    <div class="dial-outer">
                        <div class="dial-inner storage-inner">
                            <div class="usage">
                                {{ stats.cache.storageUsage }}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="section section-graph">
            <Line :data="data" :options="options" />
        </div>
        <div class="section section-buttons">
            <div class="button button-dashboard" @click="openDashboard">
                Dashboard
            </div>

            <div class="button button-settings" @click="$emit('settings')">
                Server Settings
            </div>

            <div class="button button-delete" @click="deleteServer">
                Delete Server
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    margin-bottom: 2rem;
    padding: 1rem 1.5rem;

    border-radius: 10px;

    background-color: $gray6;
}

.section {
    height: 100%;
}

.title {
    margin: 0;

    font-size: 1.5rem;
    font-weight: 600;
}

.time {
    margin: 0.25rem 0 0 0;

    font-size: 0.75rem;
    font-style: italic;
    color: #5B5B5B;
}

.tags {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    margin: 0.75rem 0 1rem 0;
}

.tag {
    margin-right: 1rem;
    padding: 4px 18px;

    border-radius: 1000px;

    font-size: 0.70rem;
    font-weight: 400;
}

.tag-status {
    background-color: rgba($green, 0.1);
    color: $green;
}

.tag-level {
    background-color: rgba($blue, 0.1);
    color: $blue;
}

.dials {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
}

.dial {
    margin-right: 1rem;
}

.dial-title {
    width: fit-content;

    margin: 0 auto 0.5rem auto;

    font-size: 0.75rem;
    font-weight: 400;
    color: $gray1;
}

.dial-outer {
    height: 3.75rem;
    width: 3.75rem;

    padding: 6px;

    border-radius: 1000px;

    background-color: rgba(#263559, 0.4);
}

.dial-inner {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: 100%;

    border: 3px rgba($blue, 0.8) solid;
    border-radius: 1000px;
}

.ram-inner {
    border-color: $green;
}

.storage-inner {
    border-color: $red;
}

.usage {
    font-size: 0.75rem;
}

.section-graph {
    flex-grow: 1;

    height: 11rem;

    margin: auto 3rem 0 3rem;
}

.button {
    height: 100%;
    width: fit-content;

    margin-left: auto;

    border-radius: 5px;

    margin-bottom: 1rem;
    padding: 0.75rem 1.25rem;

    font-size: 0.75rem;
    font-weight: 500;
    background-color: rgba(white, 0.1);
    color: white;

    &-dashboard {
        background-color: rgba($green, 0.1);
        color: $green;
    }

    &-settings {
        background-color: rgba($blue, 0.1);
        color: $blue;
    }

    &-delete {
        background-color: rgba($red, 0.1);
        color: $red;

        margin-bottom: 0;
    }

    &:hover {
        cursor: pointer;
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
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
)

const token = useCookie('token')
const servers = useState("servers")
const activeServer = useState("activeServer")
const activeServerCookie = useCookie("activeServer", {
    maxAge: 2592000,
    sameSite: 'lax'
})

const props = defineProps({
    name: String,
    _id: String,
    stats: Object
})

let options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    pointRadius: 0,
    pointHoverRadius: 0,
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
                    size: 0
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
                stepSize: 50,
                callback: function (value) {
                    return value + '%'
                },
                font: {
                    size: 0
                },
                color: '#A3A3A3'
            }
        }
    }
}

function getDataset(index) {
    const values = []

    for (var timeData of props.stats.cache.graphs.day) {
        var value = timeData[index] / timeData.dataCount
        values.push(isNaN(value) && index != 'storage' || value == Infinity ? 0 : value)
    }

    return values
}

const data = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
    datasets: [
        {
            label: 'CPU Usage',
            backgroundColor: '#00C2FF',
            borderColor: "#00C2FF",
            data: getDataset('cpu'),
            lineTension: 0.3
        },
        {
            label: 'RAM Usage',
            backgroundColor: '#00FF75',
            borderColor: "#00FF75",
            data: getDataset('ram'),
            lineTension: 0.3
        },
        {
            label: 'Storage Usage',
            backgroundColor: '#FF3030',
            borderColor: "#FF3030",
            data: getDataset('storage'),
            lineTension: 0.3,
            spanGaps: true
        }
    ]
}

const stats = props.stats

function deleteServer() {
    if (confirm("Are you sure you want to delete this server? There is no undo option.")) {
        useFetch('http://localhost:3020/api/servers/delete', {
            method: "POST",
            body: {
                name: props.name
            }
        })

        window.location.reload(true)
    }
}

function openDashboard() {
    activeServerCookie.value = servers.value.find(server => server._id == props._id)
    activeServer.value = servers.value.find(server => server._id == props._id)
    navigateTo('/u/server/overview')
}
</script>