import Vue from 'vue'
import { ck } from '~/cloudkit'

export default function CloudKitPlugin({}, inject) {
  ck.configure({
    containerIdentifier: '<%= options.containerIdentifier %>',
    apiToken: '<%= options.apiToken %>',
    environment: '<%= options.environment %>'
  } as any)

  Vue.$ck = ck
  inject('ck', ck)
}
