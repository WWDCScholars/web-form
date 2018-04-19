<template lang="pug">
.container-fluid.color-gray
  h2.color-blue Welcome to WWDCScholars!
  h3.color-blue Have you signed up for an account at WWDCScholars before?

  .link-form.form-color-blue
    .link-step.link-step-0(v-if="stepIndex === 'start'")
      p.
        If you did, please provide the email address you used for your old account, so we can link it with your new one and display past WWDC scholarships on your profile.
      p.
        If you never had WWDCScholars account before, select #[i First-time Scholar].

      .cta-group
        button(@click="nextStep").btn.btn-secondary Signed Up Before
        nuxt-link(:to="firstStepLink").btn.btn-secondary First-time Scholar

    .link-step.link-step-1(v-else-if="stepIndex === 'find'")
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

      button(@click="prevStep").btn.btn-secondary.cta-left Back
      button(@click="find", :disabled="findDisabled || errors.any()").btn.btn-primary.cta-right Find

    .link-step.link-step-2(v-if="stepIndex === 'found'")
      h4 Are you #[b {{ scholarName }}]?
      .cta-group
        button(@click="prevStep").btn.btn-secondary No
        button(@click="link").btn.btn-primary Yes
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { InputText } from '~/components/inputs';
import { Getter, Action, namespace } from 'vuex-class';

const StepsGetter = namespace('steps', Getter);
const CloudKitAction = namespace('cloudkit', Action);

enum StepIndex {
  start = 'start',
  find = 'find',
  found = 'found'
}

@Component({
  components: { InputText },
  middleware: 'auth'
} as any)
export default class PageLink extends Vue {
  $cloudKit: any

  stepIndex: StepIndex = StepIndex.start;
  email: string = ''
  errorComment: string = '';
  findDisabled: boolean = true
  scholar: any = undefined;

  @StepsGetter
  firstStep

  @CloudKitAction('linkScholar')
  linkScholar

  get firstStepLink() {
    return { name: 'step-slug', params: { slug: this.firstStep.slug } };
  }

  validate({ params }) {
    const si: StepIndex = StepIndex[params.id as string];
    if (si || !params.id) {
      return true;
    }

    return false;
  }

  created() {
    this.stepIndex = StepIndex[this.$route.params.id as string] || StepIndex.start;
  }

  nextStep() {
    switch (this.stepIndex) {
    case StepIndex.start:
      this.stepIndex = StepIndex.find;
      break;
    case StepIndex.find:
      this.stepIndex = StepIndex.found;
      break;
    }
  }

  prevStep() {
    switch (this.stepIndex) {
    case StepIndex.found:
      this.stepIndex = StepIndex.find;
      break;
    case StepIndex.find:
      this.stepIndex = StepIndex.start;
      break;
    }
  }

  async find() {
    if (!this.email) { return; }
    this.$loading.start();
    const { records } = await this.$cloudKit.query(
      'Scholar',
      [{ comparator: 'EQUALS', fieldName: 'email', fieldValue: { value: this.email } }],
      { resultsLimit: 1 }
    );
    this.$loading.finish();
    if (records && records[0]) {
      this.scholar = records[0];
      this.nextStep();
    } else {
      this.$loading.fail();
      this.errorComment = 'Please make sure this is the same email address you used in the past.';
    }
  }

  async link() {
    if (!this.scholar) { return; }

    this.$loading.start();
    await this.linkScholar(this.scholar);
    this.$loading.finish();
    this.$router.push(this.firstStepLink);
  }

  get errors() {
    return this.$validator.errors;
  }

  get scholarName() {
    return this.scholar ? `${this.scholar.fields.firstName.value} ${this.scholar.fields.lastName.value}` : 'Error';
  }

  get $loading() {
    return this.$root['$loading'];
  }
}
</script>

<style lang="sass" scoped>
.link-form
  margin-top: 40px

  .cta-right
    float: right

  .cta-left
    float: left

  .input-error
    font-size: 0.8em
    margin-left: 2px
    margin-top: 1px
    color: $sch-error

  .comment
    color: $sch-gray
    margin-top: 15px

.link-step
  > *
    margin-bottom: 14px

.cta-group
  display: flex
  justify-content: center
  align-items: center

  .btn
    text-transform: none
    padding: 14px
    margin: 0 10px
    flex-grow: 1

    &:first-child
      margin-left: 0
    &:last-child
      margin-right: 0
</style>
