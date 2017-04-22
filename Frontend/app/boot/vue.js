import Vue from 'vue'
import config from 'config'

// Vue plugins
import Router from 'vue-router'
import Store from 'vue-stash'
import * as VueGoogleMaps from 'vue2-google-maps'

[Router, Store].forEach(Plugin => Vue.use(Plugin))

Vue.use(VueGoogleMaps, {
  load: {
    key: config.googleMaps.apiKey,
    libraries: 'places' // If place input is needed
  }
})

export { Vue, Router }
