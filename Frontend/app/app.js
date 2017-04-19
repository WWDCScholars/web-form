import { Vue, router, store } from './boot/core'
import App from './components/App.vue'

new Vue({
  router,
  el: '#app',
  render: h => h(App),
  data: { store },
  mounted () {
    store.auth.setVm(this)
  }
})

window.addEventListener('cloudkitloaded', () => {
  store.auth._ckConfigureCloudKit()
})

export { router }
