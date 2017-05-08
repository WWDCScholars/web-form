<template lang="pug">
.page-thankyou
  .bg-wrapper
    .container
      h2.color-blue Thanks for joining us!
      h3.color-blue We will review your profile as soon as possible.
      p.
        In the meantime, you should check out the other great ways to connect with fellow Scholarship winners. We have listed some of them below.

    .social-links
      a(href="https://www.facebook.com/groups/1854279174824050"): img(src="~images/icon-facebook.png")
      a(href="https://twitter.com/WWDCScholars"): img(src="~images/icon-twitter.png")
      a(href="https://wwdc.slack.com"): img(src="~images/icon-slack.png")
      a(href="https://t.me/joinchat/AAAAAEDVzkDde1wIPg7qjA"): img(src="~images/icon-telegram.png")
</template>

<script>
export default {
  name: 'welcome',
  store: [],
  data () {
    return {

    }
  },
  computed: {},
  mounted() {
    document.getElementById('app').classList.add('app-page-100')
  },
  methods: {},
  components: {}
}
</script>

<style lang="css">
</style>
