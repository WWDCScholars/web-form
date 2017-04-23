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
    this.changeStep()
  },
  watch: {
    '$route': 'changeStep'
  },
  methods: {
    changeStep () {
      this.step = this.$store.steps[this.$route.params.step.split('-')[0]]
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
