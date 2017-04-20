import Vue from 'vue'

// Vue plugins
import Router from 'vue-router'
import Store from 'vue-stash'
import VueFlatpickr from 'vue-flatpickr2'

[Router, Store, VueFlatpickr].forEach(Plugin => Vue.use(Plugin))

export { Vue, Router }
