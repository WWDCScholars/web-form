<template lang="pug">
.container-fluid.color-gray
  h2.color-blue Welcome to WWDCScholars!
  h3.color-blue Are you a 2019 Scholarship Winner?
  p.
    First of all - congratulations! Whether you're a first-time winner, or a returning Scholar, you've achieved something special and should be very proud!
  p.
    Now it's time you showcase your talent and connect with the other winners you will be spending the week with in San Jose!

  p.
    Sign in with your Apple ID below to get started. We use CloudKit for authentication and we do not get to see any of your login details as everything is handled between Apple and you.

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
