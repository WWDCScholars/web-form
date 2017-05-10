<template lang="pug">
header(:class="routeClass").container-fluid
  h1
    .wwdc WWDC
    .scholars Scholars
  //- .progress Step 1 of 3
  div(id="apple-sign-out-button")
</template>

<script>
export default {
  name: 'page-header',
  store: [],
  data () {
    return {

    }
  },
  computed: {
    routeClass () {
      return 'header-' + this.$route.path.split('/').filter(part => Boolean(part)).join('-')
    }
  },
  mounted () {},
  methods: {},
  components: {}
}
</script>

<style lang="css">
</style>
