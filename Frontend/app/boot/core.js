require('./libraries')

import { Vue } from './vue'
import store from './../store'

// Initialize models of steps
for (var s = 0; s < store.steps.length; s++) {
  const step = store.steps[s]
  for (var g = 0; g < step.groups.length; g++) {
    const group = step.groups[g]
    for (var f = 0; f < group.fields.length; f++) {
      const field = group.fields[f]
      field.model = ''
    }
  }
}

import Router from './router'
const router = Router(store.auth)

store.auth.router = router

export { Vue, router, store }
