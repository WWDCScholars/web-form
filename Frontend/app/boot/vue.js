import Vue from 'vue'

// Vue plugins
import Router from 'vue-router'
import Store from 'vue-stash'
import VueClip from 'vue-clip'

[Router, Store, VueClip].forEach(Plugin => Vue.use(Plugin))

export { Vue, Router }
