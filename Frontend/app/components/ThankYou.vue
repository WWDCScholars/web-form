<template lang="pug">
.container.code
  h2
    span.color-blue print
    span.color-black (
    span.color-red "Thank you, Scholar!"
    span.color-black )

  - var batches = ['batch2017', 'batch2016', 'batch2015', 'batch2014', 'batch2013', 'batch2012', 'batchEarlier']
  .code-block.code-medium.color-black
    .code-block.color-green.
      #[.code-line.color-black /*]
      If you like our project and want to help improve it, you can do a pull request at it's #[a(href="https://github.com/WWDCScholars/WWDCScholars-form", target="_blank") GitHub Repo]
    .code-block.color-blue.
      If you know someone who has received a WWDC Scholarship before, please share this form with them. We are collecting all the batches from current and past years. :)
    .code-block.color-yellow.
      All public details submitted will be shown on the #[a(href="http://wwdcscholars.com/", target="_blank") WEBSITE] and in the #[a(href="https://itunes.apple.com/us/app/scholars-of-wwdc/id999731893?mt=8", target="_blank") APP]. If you have any concerns, email us at #[a(href="mailto:team@wwdcscholars.com") team@wwdcscholars.com].
    .code-line */

  page-footer
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
  mounted() {},
  methods: {},
  components: {
    'page-footer': require('./Footer.vue')
  }
}
</script>

<style lang="css">
</style>
