import { CloudKit } from '~/cloudkit'

export default async function({ app, route, store }) {
  // listen on CloudKit authentication events
  app.$ck.on('authenticated', (userIdentity: CloudKit.UserIdentity) => {
    console.log('onAuthenticated')
  })

  app.$ck.on('unauthenticated', (container: CloudKit.Container) => {
    console.log('onUnauthenticated')
  })
}