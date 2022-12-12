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
        '@nuxt/image-edge'
    ],
    proxy: {
        proxies: {
            '/api': {
                target: 'http://localhost:3021',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        },
        fetch: true
    }
})
