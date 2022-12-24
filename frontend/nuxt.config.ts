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
        }
    },
    modules: [
        '@nuxt-alt/proxy',
        '@nuxt/image-edge',
        'nuxt-socket-io'
    ],
    proxy: {
        proxies: {
            '/api': {
                target: 'http://localhost:3021',
                rewrite: path => path.replace(/^\/api/, '')
            }
        },
        fetch: true
    },
    io: {
        sockets: [
            {
            name: 'main',
            url: 'http://localhost:3021/',
            default: true
        }
    ]
    }
})
