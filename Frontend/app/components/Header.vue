<template lang="pug">
header(:class="routeClass").container-fluid.title
  .container
    h1
      .wwdc WWDC
      .scholars Scholars
    router-link(:to="{ name: 'welcome' }"): img(src="/images/wwdcscholars-logo.png").logo
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
  mounted() {},
  methods: {},
  components: {}
}
</script>

<style lang="css">
</style>
