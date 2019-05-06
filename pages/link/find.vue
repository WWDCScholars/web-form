<template lang="pug">
.link-steps-find
  .link-step.link-step-find(v-if="!scholar")
    p.
      Please provide the email address you used to sign up at WWDCScholars.
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
    h4 Are you #[b {{ scholarName }}]?

    p.
      To link your existing profile to your iCloud account, you have to verify your email address.
      When you click #[i Link my Profile], we will send an email to the address you specified. Please follow the instructions in the email to link your existing profile to your iCloud account.

    input-checkbox(
      name="gdprConsent",
      placeholder="I agree to the <a target=\"_blank\" href=\"/privacy\">privacy policy</a> and want to link my profile to my iCloud account.",
      v-model="gdprConsent"
    )

    .cta-group
      button(@click="reset").btn.btn-secondary Try Again
      button(@click="sendEmail", :disabled="!gdprConsent").btn.btn-primary Link my Profile

    .comment {{ errorComment }}
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { InputText, InputCheckbox } from '~/components/inputs'
import { CloudKit } from '~/model'

import * as api from '~/store/api'
const API = namespace(api.name)

@Component({
  components: { InputText, InputCheckbox }
})
export default class PageLinkFind extends Vue {
  findDisabled: boolean = true
  errorComment: string = ''
  email: string = ''
  scholar: { givenName: string, familyName: string } | null = null
  gdprConsent: boolean = false

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

      this.errorComment = ''
      this.scholar = { givenName: result.givenName, familyName: result.familyName }
    } catch {
      this.$nuxt.$loading.fail!()
      this.errorComment = 'Please make sure this is the same email address as you used in the past.'
    }
  }

  reset() {
    this.gdprConsent = false
    this.scholar = null
    this.email = ''
  }

  async sendEmail() {
    if (!this.email || !this.gdprConsent) {
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
