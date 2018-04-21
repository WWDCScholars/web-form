require('dotenv').config();
const parseArgs = require('minimist');
const argv = parseArgs(process.argv.slice(2), {
  alias: {
    H: 'hostname',
    p: 'port'
  },
  string: ['H'],
  unknown: parameter => false
});
const version = require('./package.json').version;

const port =
  argv.port ||
  process.env.PORT ||
  process.env.npm_package_config_nuxt_port ||
  '3000';
const host =
  argv.hostname ||
  process.env.HOST ||
  process.env.npm_package_config_nuxt_host ||
  'localhost';

module.exports = {
  mode: 'spa',
  env: {
    ...process.env,
    baseUrl: process.env.BASE_URL || `http://${host}:${port}`
    // GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
  },
  head: {
    title: 'Join WWDCScholars!',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
      { name: 'description', content: 'Are you WWDC 2018 Scholarship Winner? Sign up now!' },
      { name: 'keywords', content: 'WWDCScholars,WWDC,Scholars,Form,Website,App,Apple' },
      { name: 'author', content: 'WWDCScholars' },
      { name: 'og:image', content: '/images/fb-og-image.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/images/favicon.ico' },
      { rel: 'apple-touch-icon-precomposed', href: '/images/favicon-180.png', sizes: '180x180' },
      { rel: 'apple-touch-icon-precomposed', href: '/images/favicon-150.png', sizes: '152x152' },
      { rel: 'apple-touch-icon-precomposed', href: '/images/favicon-120.png', sizes: '120x120' }
    ]
  },
  loading: {
    color: 'rgb(65, 53, 153)',
    failedColor: '#D83946'
  },
  /*
  ** Build configuration
  */
  generate: {
    fallback: '404.html'
  },
  css: [
    { src: '~/assets/sass/app/_index.sass', lang: 'sass' }
  ],
  build: {
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|ts|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    },
    extractCSS: false,
    analyze: {
      analyzerMode: 'static'
    }
  },
  modules: [
    '~/modules/typescript.js',
    '@nuxtjs/sentry',

    // load global sass variables & mixins
    ['nuxt-sass-resources-loader', '@/assets/sass/imports/_index.sass'],

    // enable cloudkit supprt
    ['nuxt-cloudkit', {
      containerIdentifier: process.env.CLOUDKIT_CONTAINER_IDENTIFIER,
      apiToken: process.env.CLOUDKIT_API_TOKEN,
      environment: process.env.CLOUDKIT_ENVIRONMENT
    }],

    '@nuxtjs/dotenv'
  ],
  plugins: [
    { src: '~plugins/vee-validate' },
    { src: '~plugins/vue2-google-maps' },
    { src: '~plugins/cloudkit' },
    { src: '~plugins/validation-helper' }
  ],
  vendor: [
    'vee-validate',
    'vue2-google-maps',
    'pica',
    'moment',
    'flatpickr'
  ],
  sentry: {
    dsn: process.env.SENTRY_DSN,
    config: {
      environment: process.env.SENTRY_ENVIRONMENT,
      release: version,
      autoBreadcrumbs: { ui: false }
    }
  }
};
