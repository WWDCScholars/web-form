<template lang="pug">
.container-fluid.color-gray
  h2.color-blue Welcome to WWDCScholars!
  h3.color-blue Have you signed up for an account at WWDCScholars before?

  .link-form.form-color-blue
    nuxt-child
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  middleware: ['authenticated', 'noprofile', 'unsubmitted']
})
export default class PageLink extends Vue {}
</script>

<style lang="sass" scoped>
.link-form
  margin-top: 40px

  /deep/.link-step
    > *
      margin-bottom: 14px

    .input-error
      font-size: 0.8em
      margin-left: 2px
      margin-top: 1px
      color: $sch-error

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
