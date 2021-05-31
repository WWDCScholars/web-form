<template lang="pug">
.container-fluid.color-gray
  h2.color-blue Welcome to WWDCScholars!
  h3.color-blue Are you a 2021 Swift Student Challenge Winner?
  p.
    First of all - congratulations! Whether you're a first-time winner, or a returning Scholar, you've achieved something special and should be very proud!
  p.
    Now it's time you showcase your talent and connect with the other winners!

  p.
    Sign in with your Apple ID below to get started. We use iCloud for authentication and we do not get to see any of your login details as everything is handled between Apple and you.

  p: i.
    Do you want to link your existing WWDCScholars profile to your iCloud account to make your profile visible on our website? Sign in below and follow the instructions!

  hr

  .signin-wrapper
    a(:href="signInURL").btn.btn-sign-in Sign in with Apple ID
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { namespace } from 'vuex-class'

import * as api from '~/store/api'
const API = namespace(api.name)

@Component({
  middleware: ['anonymous', 'noprofile', 'unsubmitted']
})
export default class PageIndex extends Vue {
  @API.State
  signInURL!: string
}
</script>

<style lang="sass" scoped>
p a
  color: $apl-black

i
  font-size: 0.9em

.signin-wrapper
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
  padding: 15px 0

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

  +for-tablet-landscape-up
    padding: 0


</style>
