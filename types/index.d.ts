import Vue from 'vue'
import '@nuxtjs/axios'

import { CKConnection } from '~/cloudkit'
import * as Sentry from '@sentry/browser'

declare module '@nuxt/vue-app' {
  interface Context {
    $ck: CKConnection
    $sentry: typeof Sentry
  }
}

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue> {
    $ck: CKConnection
    $sentry: typeof Sentry
  }

  interface Vue {
    $ck: CKConnection
    $sentry: typeof Sentry
  }
}

declare module 'vuex' {
  interface Store<S> {
    $ck: CKConnection
    $sentry: typeof Sentry
  }
}
