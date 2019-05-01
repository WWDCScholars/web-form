<template lang="pug">
.link-steps-find
  .link-step.link-step-find(v-if="!scholar")
    input-text(
      name="signedUpBefore_email",
      type="email",
      placeholder="Email",
      :required.once="true",
      v-model="email",
      @input="findDisabled = false",
      v-validate="'required|email'",
      data-vv-as="Email",
      data-vv-value-path="value_validate"
    )
    .input-error(v-if="errors.has('signedUpBefore_email')") {{ errors.first('signedUpBefore_email') }}
    .comment {{ errorComment }}

    .cta-group
      nuxt-link(to="/link").btn.btn-secondary.cta-left Back
      button(@click="find", :disabled="findDisabled || errors.any()").btn.btn-primary.cta-right Find

  .link-step.link-step-found(v-else)
    p.
      To link your existing profile to your iCloud account, you have to verify your email address.
      When you click #[i Yes], we will send an email to the address you specified. Please follow the instructions in the email to link your existing profile to your iCloud account.
    h4 Are you #[b {{ scholarName }}]?

    .cta-group
      button(@click="reset").btn.btn-secondary No
      button(@click="sendEmail").btn.btn-primary Yes

    .comment {{ errorComment }}
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { InputText } from '~/components/inputs'
import { CloudKit } from '~/model'

import * as api from '~/store/api'
const API = namespace(api.name)

@Component({
  components: { InputText }
})
export default class PageLinkFind extends Vue {
  findDisabled: boolean = true
  errorComment: string = ''
  email: string = ''
  scholar: { givenName: string, familyName: string } | null = null

  @API.State
  userIdentity!: CloudKit.UserIdentity

  get scholarName(): string {
    if (!this.scholar) {
      return ''
    }

    return `${this.scholar.givenName} ${this.scholar.familyName}`
  }

  async find() {
    if (!this.email) {
      return
    }

    this.$nuxt.$loading.start()
    try {
      const result = await this.$axios.$get('/query', {
        params: { email: this.email }
      })
      this.$nuxt.$loading.finish()

      this.scholar = { givenName: result.givenName, familyName: result.familyName }
    } catch {
      this.$nuxt.$loading.fail!()
      this.errorComment = 'Please make sure this is the same email address you used in the past.'
    }
  }

  reset() {
    this.scholar = null
    this.email = ''
  }

  async sendEmail() {
    if (!this.email) {
      return
    }

    this.$nuxt.$loading.start()
    try {
      await this.$axios.$post('/request', {
        email: this.email,
        userIdentity: this.userIdentity
      })
      this.$nuxt.$loading.finish()

      this.$router.push('/link/verify')
    } catch {
      this.$nuxt.$loading.fail!()
      this.errorComment = 'There was a problem sending the email. Please try again later.'
    }
  }
}
</script>

<style lang="sass" scoped></style>
