import Vue from 'vue'
import config from 'config'
import moment from 'moment'

// Vue plugins
import Router from 'vue-router'
import Store from 'vue-stash'
import * as VueGoogleMaps from 'vue2-google-maps'
import VeeValidate, { Validator } from 'vee-validate'
Validator.installDateTimeValidators(moment)
import '../modules/inputValidators'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

[Router, Store, VeeValidate].forEach(Plugin => Vue.use(Plugin))

Vue.use(VueGoogleMaps, {
  load: {
    key: config.googleMaps.apiKey,
    libraries: 'places' // If place input is needed
  }
})

Raven
  .config(config.sentry.clientKey, {environment: config.sentry.environment, release: RELEASE, autoBreadcrumbs: {'ui.input': false} })
  .addPlugin(RavenVue, Vue)
  .install()

export { Vue, Router, Raven }
