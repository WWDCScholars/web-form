<template lang="pug">
.input-date(:class="{ 'input-has-value': inputHasValue }")
  label
    flat-pickr(
      ref="fp",
      :config.once="config",
      :value="value",
      @input="update($event)"
    )
    span.title {{ placeholder }}
    span.optional(v-if="!required") Optional
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator';
import FlatpickrComponent from 'vue-flatpickr-component';
import * as flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

@Component({
  components: {
    'flat-pickr': FlatpickrComponent
  }
})
export default class InputDate extends Vue {
  @Model('input')
  value: string | Date

  @Prop()
  placeholder: string
  @Prop()
  required: boolean
  @Prop()
  onlyPast: boolean
  @Prop()
  displayFormat: string

  value_validate: string

  config?: { dateFormat: string; maxDate: (Date | undefined); } = undefined;

  created() {
    this.config = {
      dateFormat: this.displayFormat,
      maxDate: undefined
    };
    if (this.onlyPast) {
      this.config.maxDate = new Date();
    }
  }

  update(value) {
    this.$emit('input', value);
    this.value_validate = value;
  }

  get inputHasValue() {
    return this.value;
  }
}
</script>

<style lang="sass" scoped>
.input-date
  position: relative
  width: 100%

  input
    width: 100%
    font-size: 1em
    padding: 15px 15px 5px 15px
    border: 1px solid $form-border-color
    border-radius: $border-radius
    color: $sch-gray
    transition: border-color 100ms linear, box-shadow 100ms linear

  .title
    position: absolute
    top: 50%
    left: 15px
    transform: translateY(-50%)
    color: lighten($sch-gray, 24%)
    pointer-events: none
    transition: all 100ms linear

  input:focus + .title, &.input-has-value .title
      top: 11px
      font-size: 12px

  .optional
    position: absolute
    color: $sch-gray1
    top: 50%
    right: 15px
    transform: translateY(-50%)
    font-size: 0.9em

+form-colors
  $bg: dyn-temp('bg')
  $fg: dyn-temp('fg')
  .input-date
    input
      &:hover, &:focus
        border-color: $bg

      &:focus
        box-shadow: 0 0 4px transparentize($bg, 0.6)

      &:focus + .title
        color: $bg
</style>

<style lang="sass">
+form-colors
  $bg: dyn-temp('bg')
  .input-date
    .flatpickr-mobile
      color: $bg
</style>
