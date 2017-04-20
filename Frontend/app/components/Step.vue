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
      step: this.$store.steps[this.$route.params.step.split('-')[0]],
    }
  },
  computed: {},
  mounted() {},
  methods: {},
  components: {
    'step-form': require('./steps/Step-Form.vue')
  }
}
</script>

<style lang="css">
</style>
