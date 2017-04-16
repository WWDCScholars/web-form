<template lang="pug">
#app
  page-header
  router-view
</template>

<script>
export default {
  name: 'App',
  store: [],
  data () {
    return {

    }
  },
  computed: {},
  mounted () {},
  methods: {},
  components: {
    'page-header': require('./Header.vue')
  }
}
</script>

<style lang="css">
</style>
