import { Router } from './vue'
import routes from './../routes'

const router = new Router({
  mode: 'hash',
  // mode: 'history', // use html5 history features
  // hashbang: false, // remove the hashbang from the url
  routes
})

// router.beforeEach()

export default router
