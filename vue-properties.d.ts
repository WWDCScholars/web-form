import { Vue } from 'nuxt-property-decorator'
import { CKConnection } from '~/cloudkit'

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue> {
    $ck: CKConnection
  }

  interface Vue {
    $ck: CKConnection
  }
}
