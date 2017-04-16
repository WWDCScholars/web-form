import { Vue, router, store } from './boot/core'
import App from './components/App.vue'

new Vue({
  router,
  el: '#app',
  render: h => h(App),
  data: { store },
  mounted () {

  }
})

export { router }
