<template lang="pug">
.container-fluid.link-form.form-color-orange
  .link-step
    h3.color-orange Linking complete
    h4.color-orange Have you won a WWDC 2019 Scholarship?

    p.
      If you did, select #[i Sign Up For 2019], fill out the form and connect with
      all the other Scholarship winners from around the world!

    p.
      If you linked your existing WWDCScholars profile to your iCloud account and
      don't want to submit a WWDC 2019 profile, you can check out your profile on
      our homepage.

    .cta-group
      a(href="https://wwdcscholars.com").btn.btn-secondary Go to Homepage
      nuxt-link(:to="firstStepLink").btn.btn-primary Sign Up for 2019
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { Step } from '~/model'

import { name as stepsName } from '~/store/steps'
const Steps = namespace(stepsName)

@Component({
  middleware: ['authenticated', 'unsubmitted']
})
export default class PageStepStart extends Vue {
  @Steps.Getter
  firstStep!: Step

  get firstStepLink(): object {
    return {
      name: 'step-slug',
      params: { slug: this.firstStep.slug }
    }
  }
}
</script>

<style lang="sass" scoped>
.link-form
  margin-top: 40px

  .link-step
    > *
      margin-bottom: 14px

    .cta-group
      display: flex
      justify-cotent: center
      align-items: center

      .btn
        text-transform: none
        margin: 0 10px
        flex-grow: 1

        &:first-child
          margin-left: 0
        &:last-child
          margin-right: 0

      .cta-left
        float: left

      .cta-right
        float: right
</style>
