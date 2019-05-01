<template lang="pug">
.page-thankyou
  .container-fluid.thankyou
    h2.color-blue Thanks for joining us!
    h3.color-blue We will review your profile as soon as possible.
    p.
      In the meantime, you should check out the other great ways to connect with fellow Scholarship winners. We have listed some of them below.

    .social-links
      a(href="https://twitter.com/WWDCScholars")
        img(src="~assets/images/icon-twitter-large.png")
      a(href="https://discord.gg/cR2cQ74")
        img(src="~assets/images/icon-discord-large.png")
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  middleware: ['authenticated', 'submitted']
})
export default class PageThankyou extends Vue {}
</script>

<style lang="sass" scoped>
.page-thankyou
  position: relative
  height: calc(100vh - #{$header-height})
  margin-bottom: -85px
  text-align: center
  background-image: url("~assets/images/scholars-hero.jpg")
  background-size: cover
  background-position: center bottom

  &:after
    content: ''
    display: block
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0
    background-image: linear-gradient($background-gray, 0%, transparentize($background-gray, 0.075) 400px, transparentize($background-gray, 1.0) 100%), linear-gradient(transparent calc(100% - 60px), $background-gray calc(100% - 59px), $background-gray 100%)
    z-index: 100

.thankyou
  position: relative
  z-index: 200

.social-links
  margin: 60px 0 35px

  a img
    width: 100px
    height: 100px
    padding: 10px
</style>
