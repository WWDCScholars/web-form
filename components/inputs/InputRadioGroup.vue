<template lang="pug">
.input-radio-group
  label.input-radio(v-for="option in options")
    input(
      type="radio",
      :name.once="name",
      :required.once="required",
      :value="option",
      :checked="option === value"
      @change="update($event.target.value)"
    )
    span {{ option }}
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class InputRadioGroup extends Vue {
  @Model('change')
  value: string

  @Prop()
  name: string
  @Prop()
  options: string[]
  @Prop()
  required: boolean

  value_validate: string

  update(value) {
    this.$emit('change', value);
    this.value_validate = value;
  }
}
</script>

<style lang="sass" scoped>
.input-radio-group
  display: flex
  flex-wrap: wrap
  justify-content: flex-start
  align-items: center

  .input-radio
    position: relative
    margin: 0 15px 15px 0
    cursor: pointer

    &:hover
      background-color: darken($background-gray, 6%)

    span
      display: block
      width: 110px
      padding: 10px
      border: 1px solid $form-border-color
      text-transform: uppercase
      border-radius: $border-radius
      color: $sch-gray
      background-color: $white
      text-align: center
      transition: background-color 100ms linear, border-color 100ms linear, color 100ms linear

      &:hover
        background-color: darken($background-gray, 6%)

    input
      appearance: none
      outline: 0
      position: absolute
      opacity: 0

+form-colors
  $bg: dyn-temp('bg')
  $fg: dyn-temp('fg')
  .input-radio
    input:checked + span
      background-color: $bg
      border-color: $bg
      color: $fg

    input:checked + span:hover
      background-color: darken($bg, 10%)
      border-color: darken($bg, 10%)
</style>
