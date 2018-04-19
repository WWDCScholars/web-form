<template lang="pug">
header.header
  h1
    span.wwdc WWDC
    span.scholars Scholars
  .spacer
  #apple-sign-out-button
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class PageHeader extends Vue {
}
</script>

<style lang="sass" scoped>
.header
  width: 100%
  height: $header-height
  background-color: transparentize($white, 0.5)
  border-bottom: 1.5px solid rgb(228, 228, 228)
  color: $white
  z-index: 999
  display: flex
  justify-content: space-between
  align-items: center
  padding: 0 20px

  .spacer
    flex-grow: 1

  h1
    font-size: 1.6em
    margin: 0
    padding: 0
    line-height: 100%
    color: $sch-purple
    font-weight: 600

    +for-tablet-landscape-up
      font-size: 1.8em

    .scholars
      font-weight: 300
</style>

<style lang="sass">
.header .apple-auth-button
  width: auto !important
  padding: 0 14px !important
  border-color: $sch-purple !important

  svg
    fill: $sch-purple !important
</style>
