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
      // Cache all static assets for offline use
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/api/, /^\/_/],
      offlineGoogleAnalytics: false,
      // Cache strategy for app shell
      runtimeCaching: [
        {
          // Cache HTML pages (NetworkFirst strategy - try network first, fallback to cache)
          urlPattern: ({ request }) => request.destination === 'document',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            },
            networkTimeoutSeconds: 3 // Fallback to cache after 3 seconds
          }
        },
        {
          // Cache CSS and JS (CacheFirst - cache first, network fallback)
          urlPattern: /\.(?:js|css)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-resources-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          // Cache images (CacheFirst)
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          // Cache fonts (CacheFirst)
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
          // Cache font files (CacheFirst)
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
        },
        {
          // Cache KaTeX CSS from CDN (for LaTeX formula rendering)
          urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/katex@.*\.css$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'katex-css-cache',
            expiration: {
              maxEntries: 5,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          // Cache API calls (NetworkFirst - try network, fallback to cache)
          urlPattern: /^https?:\/\/.*\/api\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 // 1 hour
            },
            networkTimeoutSeconds: 5
          }
        }
      ]
    }
  }
})