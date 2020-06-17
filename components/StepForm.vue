<template lang="pug">
.step-form.form
  h3 {{ step.title }}
  .group(v-for="(section, s) in step.sections")
    h4 {{ section.title }}
    .field(v-for="(field, f) in section.fields", :class="field.styleClass")
      // *TYPE radio
      input-radio-group(
        v-if="field.type === 'radio'",
        v-bind="field",
        :value="field.model",
        @change="update(s, f, $event)",
        v-validate-field="field",
        v-validate="validationOptions(field)",
        data-vv-validate-on="change"
      )

      input-date(
        v-else-if="field.type === 'date'",
        v-bind="field",
        :value="field.model",
        @input="update(s, f, $event)",
        v-validate-field="field",
        v-validate="validationOptions(field)"
      )

      input-image(
        v-else-if="field.type === 'image'",
        v-bind="field",
        :value="field.model",
        @change="update(s, f, $event)",
        v-validate-field:value="field",
        v-validate.reject="validationOptions(field)",
        data-vv-validate-on="change"
      )

      input-location(
        v-else-if="field.type === 'location'",
        v-bind="field",
        :value="field.model",
        @change="update(s, f, $event)",
        v-validate-field="field",
        v-validate="validationOptions(field)",
        data-vv-validate-on="change"
      )

      input-checkbox(
        v-else-if="field.type === 'checkbox'",
        v-bind="field",
        :value="field.model",
        @change="update(s, f, $event)",
        v-validate-field="field",
        v-validate="validationOptions(field)",
        data-vv-validate-on="change"
      )

      input-text(
        v-else,
        v-bind="field",
        :value="field.model",
        @input="update(s, f, $event)",
        v-validate-field="field",
        v-validate="validationOptions(field)",
        data-vv-validate-on="input"
      )

      .input-error(v-if="errors.has(field.name)") {{ errors.first(field.name) }}
      .comment(v-if="field.comment", v-html="field.comment")
</template>

<script lang="ts">
import { Component, Prop, Inject, Vue } from 'nuxt-property-decorator';
import { namespace } from 'vuex-class';
import { Step } from '~/model';
import {
  InputText,
  InputDate,
  InputRadioGroup,
  InputCheckbox,
  InputImage,
  InputLocation
} from '~/components/inputs';

const Steps = namespace('steps');

@Component({
  components: {
    InputText,
    InputDate,
    InputRadioGroup,
    InputCheckbox,
    InputImage,
    InputLocation
  }
})
export default class StepForm extends Vue {
  @Prop({ required: true })
  step!: Step

  @Steps.Mutation('updateField')
  updateField

  @Steps.Action('evaluateStepCompletion')
  evaluateStepCompletion

  // on field update
  update(section, field, value) {
    this.updateField({ slug: this.step.slug, section, field, value });
    Vue.nextTick(() => {
      this.evaluateStepCompletion({
        slug: this.step.slug,
        errors: this.errors.any()
      });
    });
  }

  get stepCount(): number {
    return 1;
  }

  validationOptions(field) {
    const r = {};
    if (field.required && field.type === 'image') { r['image_required'] = true; }
    else if (field.required) { r['required'] = true; }
    if (field.type === 'url') { r['url'] = true; }
    if (field.type === 'email') { r['email'] = true; }
    if (field.dimensions_min) { r['dimensions_min'] = [field.dimensions_min, field.dimensions_min]; }
    // if (field.displayFormat) { r['date_format'] = field.displayFormat; }
    return { rules: r };
  }

  get errors() {
    return this.$validator.errors;
  }
}
</script>

<style lang="sass" scoped>
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

<style lang="sass">
.step-form
  .comment
    color: $sch-gray
    margin-top: 15px

    a
      color: $sch-gray
</style>
