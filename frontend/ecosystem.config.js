module.exports = {
    apps: [{
        name: "mcss-frontend",
        script: 'npm',
        args: 'start',
    }, {
        script: './service-worker/',
        watch: ['./service-worker']
    }],
}