// Don't touch this while server is running
// nuxt-socket-io doesn't like that and breaks :(

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: [
        '@/assets/styles/global.scss'
    ],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/assets/styles/variables.scss";'
                }
            }
        },
    },
    modules: [
        'nuxt-proxy',
        '@nuxt/image-edge',
        'nuxt-socket-io'
    ],
    io: {
        // server: { teardown: false },
        sockets: [
            {
                name: 'main',
                url: process.env.SOCKET_SERVER,
                default: true
            }
        ]
    },
    runtimeConfig: {
        proxy: {
            options: [{
                target: process.env.API_SERVER,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                },
                pathFilter: [
                    '/api'
                ]
            }]
        },
        public: {
            origin: process.env.ORIGIN
        }
    }
})
