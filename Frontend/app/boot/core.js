require('./libraries')

import { Vue } from './vue'
import store from './../store'
import Router from './router'
const router = Router(store.auth)

store.auth.router = router

export { Vue, router, store }
