import Vue from 'vue'

// Vue plugins
import Router from 'vue-router'
import Store from 'vue-stash'
import * as VueGoogleMaps from 'vue2-google-maps'

[Router, Store].forEach(Plugin => Vue.use(Plugin))

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCkl5vVa7FTE4yuB0la0gF9dxdlRj7ps3A',
    // v: 'OPTIONAL VERSION NUMBER',
    libraries: 'places' // If place input is needed
  }
})

export { Vue, Router }
