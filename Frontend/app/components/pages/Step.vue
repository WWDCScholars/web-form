<template lang="pug">
.container.container-outer
  step-form(:step="step")
</template>

<script>
export default {
  name: 'welcome',
  store: ['steps'],
  data () {
    return {
      step: null,
    }
  },
  computed: {},
  mounted () {},
  created () {
    this.onRouteChanged()
  },
  watch: {
    '$route': 'onRouteChanged'
  },
  methods: {
    onRouteChanged(to, from) {
      let stepIndex = parseInt(this.$route.params.step.split('-')[0])
      this.step = this.$store.steps[stepIndex]
      window.scrollTo(0, 0)
    }
  },
  components: {
    'step-form': require('../Step-Form.vue')
  }
}
</script>

<style lang="css">
</style>
