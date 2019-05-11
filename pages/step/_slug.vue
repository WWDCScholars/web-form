<template lang="pug">
.container-fluid.step(:class="stepColorClass")
  modal-spinner(v-if="submitInProgress")
    | Beaming your profile to space...

  step-form(:step="step")

  .cta-group
    nuxt-link(
      v-if="currentStepNumber != 0",
      :to="previousLink"
    ).btn.btn-secondary.cta-left Previous
    nuxt-link(
      :class="{ 'disabled': !step.finished }",
      :to="nextLink"
    ).btn.btn-primary.cta-right Continue
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator';
import { namespace } from 'vuex-class';
import { Step, StepSection } from '~/model';
import StepForm from '~/components/StepForm.vue';
import ModalSpinner from '~/components/ModalSpinner.vue';

import { name as stepsName } from '~/store/steps'
const Steps = namespace(stepsName)

@Component({
  components: { StepForm, ModalSpinner },
  middleware: ['authenticated', 'unsubmitted']
})
export default class PageStep extends Vue {
  submitInProgress: boolean = false

  @Steps.State
  steps!: Map<string, Step>

  validate({ params, store }): boolean {
    if (!store.state.steps.steps[params.slug]) {
      return false;
    }
    const steps = store.state.steps.steps;
    const keys = Object.keys(steps);
    const i = keys.indexOf(params.slug);
    if (i !== 0 && steps[keys[i - 1]].finished !== true) {
      return false;
    }
    return true;
  }

  get step(): Step {
    return this.steps[this.$route.params.slug];
  }

  get stepCount(): number {
    return Object.keys(this.steps).length;
  }

  get currentStepNumber(): number {
    return parseInt(this.step.slug.split('-')[0]);
  }

  get stepColorClass(): string {
    return `form-color-${this.step.color}`;
  }

  get nextLink(): object {
    const keys = Object.keys(this.steps)
    const i = keys.indexOf(this.step.slug)

    if (i === keys.length - 1) {
      return { name: 'step-final' }
    }

    return {
      name: 'step-slug',
      params: { slug: keys[i + 1] }
    }
  }

  get previousLink(): object {
    const keys = Object.keys(this.steps)
    const i = keys.indexOf(this.step.slug)
    return {
      name: 'step-slug',
      params: { slug: keys[i - 1] }
    }
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
</style>
