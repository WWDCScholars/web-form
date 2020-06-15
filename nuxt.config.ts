import NuxtConfiguration from '@nuxt/config'
import { config as dotenv } from 'dotenv'
dotenv()

const version = require('./package.json').version
const isDevelopment = (process.env.NODE_ENV === 'development')
const isLocal = (process.env.LOCAL === '1')

let envPrefix: string
if (process.env.NODE_ENV === 'production') {
  envPrefix = 'PROD'
} else if (process.env.NODE_ENV === 'staging') {
  envPrefix = 'STAGE'
} else {
  envPrefix = 'DEV'
}

const proxyConfiguration = !isDevelopment ? {} : { proxy: {
  '/api': { target: 'http://localhost:3001' }
}}

const axiosBaseURL = !isDevelopment ? process.env.LINK_API_BASE_URL : '/api'

const config: NuxtConfiguration = {
  mode: 'spa',

  /*
   ** Headers of the page
   */
  head: {
    title: 'Join WWDCScholars!',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Are you a WWDC 2020 Swift Student Challenge Winner? Sign up now!'
      },
      { name: 'keywords', content: 'WWDCScholars,WWDC,Scholars,Apple' },
      { name: 'author', content: 'WWDCScholars' },
      { name: 'og:image', content: '/icons/fb-og-image.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icons/favicon.ico' },
      {
        rel: 'apple-touch-icon-precomposed',
        href: '/icons/favicon-180.png',
        sizes: '180x180'
      },
      {
        rel: 'apple-touch-icon-precomposed',
        href: '/icons/favicon-152.png',
        sizes: '152x152'
      },
      {
        rel: 'apple-touch-icon-precomposed',
        href: '/icons/favicon-120.png',
        sizes: '120x120'
      }
    ]
  },

  /*
   ** Inject process environment variables
   */
  env: {
    ...process.env as any
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: 'rgb(65, 53, 153)',
    failedColor: '#D83946'
  },

  /*
   ** Global CSS
   */
  css: ['~assets/sass/app/_index.sass'],

   /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vee-validate',
    '~/plugins/vue2-google-maps',
    '~/plugins/validation-helper',

    '~/plugins/auth'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Load global SASS variables and mixins
    '@nuxtjs/style-resources',

    // Load environment variables from `.env`
    '@nuxtjs/dotenv',

    // CloudKit connection
    ['~/cloudkit/nuxt-module', {
      containerIdentifier: `${envPrefix}_${process.env.CLOUDKIT_CONTAINER_IDENTIFIER}`,
      apiToken: `${envPrefix}_${process.env.CLOUDKIT_API_TOKEN}`,
      environment: `${envPrefix}_${process.env.CLOUDKIT_ENVIRONMENT}`
    }],

    // Axios for linking api
    '@nuxtjs/proxy',
    '@nuxtjs/axios',

    // Load sentry
    '@nuxtjs/sentry'
  ],

  /*
   ** Global SASS variables and mixins
   */
  styleResources: {
    sass: ['~assets/sass/imports/_index.sass']
  },

  /*
   ** Linking API proxy configuration
   */
  ...proxyConfiguration,

  /*
   ** Linking API configuration
   */
  axios: {
    baseURL: axiosBaseURL
  },

  /*
   ** Sentry configuration
   */
  sentry: {
    disabled: false,
    dsn: process.env.SENTRY_DSN,
    config: {
      environment: process.env.SENTRY_ENVIRONMENT,
      release: `form@v${version}`,
      autoBreadcrumbs: {
        'ui': false,
        'location': true,
        'xhr': true
      }
    }
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config: any) {
      config.node = {
        fs: 'empty'
      }

      // enable source maps
      if (isLocal) {
        config.devtool = '#source-map'
      }
    }
  },

  /*
   ** Generate a 404 page
   */
  generate: {
    fallback: '404.html'
  }
}

export default config
