<template lang="pug">
.container-fluid.step(class="form-color-blue")
  modal-spinner(
    v-if="submitInProgress",
    title="Beaming your profile to space...",
    subtitle="Depending on your internet connection, this might take a while."
  )

  .step-form.form
    h3 Last, we have to go over some legal stuff
    .group(v-if="showParentalConsent")
      h4 Since you’re below 18 years of age, your parents need to approve that they’re ok with the fact that your information will become publicly available if you register for WWDCScholars.

      .field
        input-checkbox(
          name="parentalConsent",
          placeholder="I confirm that my parents/legally authorized chaperons have allowed me to register on WWDCScholars and that they’re ok with the public display of my submitted information.",
          v-model="parentalConsent"
        )

    .group
      h4 In order to sign up you have to agree to our privacy policy.

      .field
        input-checkbox(
          name="gdprConsent",
          placeholder="I agree to the <a target=\"_blank\" href=\"/privacy\">privacy policy</a>",
          v-model="gdprConsent"
        )

    .group
      h4 Hit submit and we will review your profile as soon as possible!

  .cta-group
    nuxt-link(:to="previousLink").btn.btn-secondary.cta-left Previous
    button(
      :disabled="!submittable || submitInProgress",
      @click="submit"
    ).btn.btn-primary.cta-right Submit
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Step, StepSection } from '~/model'
import StepForm from '~/components/StepForm.vue'
import ModalSpinner from '~/components/ModalSpinner.vue'
import { InputCheckbox } from '~/components/inputs'

dayjs.extend(customParseFormat)

import { name as stepsName } from '~/store/steps'
const Steps = namespace(stepsName)
import { name as apiName } from '~/store/api'
const API = namespace(apiName)

@Component({
  components: { StepForm, ModalSpinner, InputCheckbox },
  middleware: ['authenticated', 'unsubmitted']
})
export default class PageStepLegal extends Vue {
  submitInProgress: boolean = false

  parentalConsent: boolean = false
  gdprConsent: boolean = false

  @Steps.State
  steps!: Map<string, Step>

  @Steps.Getter('birthday')
  scholarBirthday?: number | string

  @API.Action('submit')
  submitToCloudKit

  get previousLink(): object {
    const keys = Object.keys(this.steps)
    const slug = keys[keys.length - 1]
    return {
      name: 'step-slug',
      params: { slug }
    }
  }

  get showParentalConsent(): boolean {
    if (!this.scholarBirthday) {
      return false
    }

    let birthday: dayjs.Dayjs
    if (typeof this.scholarBirthday === 'string') {
      birthday = dayjs(this.scholarBirthday, 'YYYY-MM-DD')
    } else {
      birthday = dayjs(this.scholarBirthday)
    }

    const age = dayjs().diff(birthday, 'year')

    return age < 18
  }

  get submittable(): boolean {
    for (let slug in this.steps) {
      if (!this.steps[slug].finished) {
        return false
      }
    }

    if (this.showParentalConsent) {
      return this.parentalConsent && this.gdprConsent
    }

    return this.gdprConsent
  }

  async submit() {
    if (!this.submittable || this.submitInProgress) {
      return
    }

    this.submitInProgress = true;
    this.$sentry.addBreadcrumb({
      message: 'submit',
      category: 'step'
    });

    await this.submitToCloudKit(this.steps);

    this.submitInProgress = false;
    this.$router.push({ name: 'thankyou' });
  }
}
</script>

<style lang="sass" scoped>
.cta-group
  margin-top: 0

  +for-tablet-landscape-up
    margin-top: 80px

  .cta-right
    float: right

  .cta-left
    float: left

.step-form
  .group
    width: 100%
    margin-bottom: 30px
    display: grid
    grid-template-columns: 1fr 1fr
    grid-gap: 15px

    h4, .field
      grid-column: span 2

    .field
      +for-tablet-landscape-up
        &.field-width-50
          grid-column: span 1

      .input-error
        font-size: 0.8em
        margin-left: 2px
        margin-top: 1px
        color: $sch-error

+form-colors
  $bg: dyn-temp('bg')
  .step-form
    color: $bg
</style>
