import { Context } from '@nuxt/vue-app'
import { CloudKit } from '~/cloudkit'

export default async function({ env, app, route, store, $axios }: Context) {
  // set authorization token for link api
  $axios.setToken(env.LINK_API_TOKEN, 'Bearer')

  // listen on CloudKit authentication events
  app.$ck.on('authenticated', (userIdentity: CloudKit.UserIdentity) => {
    // store.dispatch('api/onAuthenticated', userIdentity)
  })

  app.$ck.on('unauthenticated', (container: CloudKit.Container) => {
    store.dispatch('api/onUnauthenticated', container)
  })

  // If the ckSession query parameter is set we returned from idmsa
  if (route.name === 'index' && route.query.hasOwnProperty('ckSession')) {
    const container = app.$ck.defaultContainer
    container['_auth']._setSession(route.query.ckSession)
  }

  // this checks if there is a valid session, and if
  // - true: triggers an authenticated event
  // - false: triggers an unauthenticated event
  const authResult = await app.$ck.setUpAuth()
  if (authResult) {
    await store.dispatch('api/onAuthenticated', authResult)
  }
}
