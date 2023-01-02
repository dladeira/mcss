module.exports = {
    apps: [{
        name: "mcss-backend",
        script: 'npm',
        args: 'start',
    }, {
        script: './service-worker/',
        watch: ['./service-worker']
    }],
}