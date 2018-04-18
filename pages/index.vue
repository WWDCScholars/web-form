<template lang="pug">
.container-fluid.color-gray
  h2.color-blue Welcome to WWDCScholars!
  h3.color-blue Are you a 2018 Scholarship Winner?
  p.
    First of all - congratulations! Whether you're a first-time winner, or a returning Scholar, you've achieved something special and should be very proud!
  p.
    Now it's time you showcase your talent and connect with the other winners you will be spending the week with in San Jose!

  hr

  .signin-wrapper
    h2.color-blue Let's get started...
    #apple-sign-in-button
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  middleware: 'no-auth'
} as any)
export default class PageIndex extends Vue {
}
</script>

<style lang="sass" scoped>
.signin-wrapper
  width: 600px
  height: 200px
  margin: 0 auto
  border: 1px solid $sch-gray0
  background-color: $white
  border-radius: $border-radius
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column

  h2
    margin: 0 0 15px
</style>
