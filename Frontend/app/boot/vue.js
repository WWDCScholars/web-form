import Vue from 'vue'

// Vue plugins
// import Http from 'vue-resource'
import Router from 'vue-router'
import Store from 'vue-stash'
// import Events from 'vue-events'

[Router, Store].forEach(Plugin => Vue.use(Plugin))

export { Vue, Router }
