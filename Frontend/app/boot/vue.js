import Vue from 'vue'
import config from 'config'

// Vue plugins
import Router from 'vue-router'
import Store from 'vue-stash'
import * as VueGoogleMaps from 'vue2-google-maps'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

[Router, Store].forEach(Plugin => Vue.use(Plugin))

Vue.use(VueGoogleMaps, {
  load: {
    key: config.googleMaps.apiKey,
    libraries: 'places' // If place input is needed
  }
})

Raven
  .config(config.sentry.clientKey, {environment: config.sentry.environment})
  .addPlugin(RavenVue, Vue)
  .install()

export { Vue, Router }
