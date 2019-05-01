<template lang="pug">
.input-checkbox
  input(
    type="checkbox",
    :id.once="name",
    :name.once="name",
    :required.once="required",
    :checked="name === value"
    @change="update($event.target.value)"
  )
  label(:for="name")
    .mark
    .label(v-html="placeholder")
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class InputCheckbox extends Vue {
  @Model('change')
  value!: boolean

  @Prop({ required: true })
  name!: string
  @Prop({ required: true })
  placeholder!: string
  @Prop({ default: false })
  required!: boolean

  value_validate: boolean = this.value || false

  update(value) {
    this.value_validate = value === 'on'
    this.$emit('change', value === 'on')
  }
}
</script>

<style lang="sass" scoped>
.input-checkbox
  position: relative
  display: block

  input
    appearance: none
    outline: none
    height: 0

  label
    display: flex
    justify-content: flex-start
    align-items: flex-start
    margin-top: -20px
    cursor: pointer

    .mark
      position: relative
      width: 28px
      height: 28px
      flex-shrink: 0
      background-color: $white
      border: 1px solid $form-border-color
      border-radius: $border-radius
      transition: background-color 100ms linear, border-color 100ms linear

      &:after
        content: ''
        position: absolute
        display: block
        top: 8px
        left: 6px
        width: 12px
        height: 6px
        border: 2px solid transparent
        border-top: none
        border-right: none
        background: transparent
        transform: rotate(-45deg)
        transition: border-color 100ms linear

    .label
      flex-grow: 1
      margin-top: 3px
      margin-left: 6px
      color: $sch-gray

    &:hover .mark:after
      border-color: $sch-gray2

  input:checked + label .mark
    background-color: $sch-gray0
    border-color: $sch-gray0

    &:after
      border-color: $white

+form-colors
  $bg: dyn-temp('bg')
  $fg: dyn-temp('fg')
  .input-checkbox
    label .label /deep/a
      color: $bg

    label:hover .mark
      border-color: lighten($bg, 20%)

    input:checked + label .mark
      background-color: $bg
      border-color: $bg
      color: $fg
</style>
