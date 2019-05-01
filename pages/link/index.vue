<template lang="pug">
.link-step.link-step-0
  p.
    If you did, please provide the email address you used for your old account, so we can link it with your new one and display past WWDC scholarships on your profile.
  p.
    If you never had WWDCScholars account before, select #[i First-time Scholar].

  .cta-group
    nuxt-link(to="/link/find").btn.btn-secondary Signed Up Before
    nuxt-link(:to="firstStepLink").btn.btn-secondary First-time Scholar
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { Step } from '~/model'

import { name as stepsName } from '~/store/steps'
const Steps = namespace(stepsName)

@Component
export default class PageLinkIndex extends Vue {
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

<style lang="sass" scoped></style>
