const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'app',
  assetsDir: 'static',
  indexPath: 'index.html',
  devServer: {
    port: 8080,
    open: true
  },
  css: {
    extract: process.env.NODE_ENV === 'production'
  },
  pwa: {
    name: 'Statistical Sample Size Calculator',
    short_name: 'Sample Size Calc',
    themeColor: '#007BFF',
    backgroundColor: '#F8F9FA',
    display: 'standalone',
    orientation: 'portrait-primary',
    scope: './',
    start_url: './',
    description: 'Professional statistical tools for research design',
    lang: 'en',
    dir: 'ltr',
    categories: ['education', 'medical', 'productivity'],
    prefer_related_applications: false,
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
  }
})