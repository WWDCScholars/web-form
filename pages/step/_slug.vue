<template lang="pug">
.container-fluid.step(:class="stepColorClass")
  modal-spinner(v-if="submitInProgress")
    | Beaming your profile to space...

  step-form(:step="step")

  .cta-group
    button(
      v-if="currentStepNumber != 0",
      @click="previousStep"
    ).btn.btn-secondary.cta-left Previous
    button(
      v-if="currentStepNumber != stepCount - 1",
      :disabled="!step.finished",
      @click="nextStep"
    ).btn.btn-primary.cta-right Continue
    button(
      v-if="currentStepNumber === stepCount - 1",
      :disabled="!submittable || submitInProgress",
      @click="submit"
    ).btn.btn-primary.cta-right Submit
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import Step from '~/types/Step';
import StepForm from '~/components/StepForm.vue';
import ModalSpinner from '~/components/ModalSpinner.vue';
import StepSection from '~/types/StepSection';

const StepsState = namespace('steps', State);
const CloudKitAction = namespace('cloudkit', Action);

@Component({
  components: { StepForm, ModalSpinner },
  middleware: 'auth'
} as any)
export default class PageStep extends Vue {
  $raven: any
  submitInProgress: boolean = false

  @StepsState('steps')
  steps: Map<string, Step>

  @CloudKitAction('submit')
  submitToCloudKit

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

  nextSlug(): string {
    const keys = Object.keys(this.steps);
    const i = keys.indexOf(this.step.slug);
    return keys[i + 1];
  }

  previousSlug(): string {
    const keys = Object.keys(this.steps);
    const i = keys.indexOf(this.step.slug);
    return keys[i - 1];
  }

  previousStep() {
    this.$raven.captureBreadcrumb({
      message: 'previous',
      category: 'step',
      data: {
        oldSlug: this.step.slug,
        newSlug: this.previousSlug()
      }
    });
    this.$router.push({
      name: 'step-slug',
      params: { slug: this.previousSlug() }
    });
  }

  nextStep() {
    this.$raven.captureBreadcrumb({
      message: 'next',
      category: 'step',
      data: {
        oldSlug: this.step.slug,
        newSlug: this.nextSlug()
      }
    });
    this.$router.push({
      name: 'step-slug',
      params: { slug: this.nextSlug() }
    });
  }

  get submittable(): boolean {
    for (let slug in this.steps) {
      if (!this.steps[slug].finished) {
        return false;
      }
    }
    return true;
  }

  async submit() {
    if (!this.submittable || this.submitInProgress) {
      return;
    }
    this.submitInProgress = true;
    this.$raven.captureBreadcrumb({
      message: 'submit',
      category: 'step'
    });

    await this.submitToCloudKit(this.steps);

    this.submitInProgress = false;
    this.$router.push({ name: 'thankyou' });
  }

  mounted() {}
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
