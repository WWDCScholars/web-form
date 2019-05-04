<template lang="pug">
header.header
  h1
    span.wwdc WWDC
    span.scholars Scholars
  .spacer
  button(
    v-if="isAuthenticated",
    @click="onSignOutClicked"
  ).btn.btn-sign-in Sign Out
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'

import * as api from '~/store/api'
const API = namespace(api.name)

@Component
export default class PageHeader extends Vue {
  @API.Getter
  isAuthenticated!: boolean

  @API.Action
  signOut

  async onSignOutClicked() {
    await this.signOut()
    this.$router.replace('/')
  }
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

  .btn-sign-in
    display: block
    width: auto
    margin-left: auto
    margin-right: auto
    padding: 10px 20px
    font-weight: 500
    color: black
    border: 1px solid black
    border-radius: $border-radius
    text-decoration: none
    text-transform: none
</style>
