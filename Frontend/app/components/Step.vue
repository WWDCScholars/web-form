<template lang="pug">
.container.code.step
  h2 /* {{ step.title }} */
  step-form(:fields="step.fields")
  router-link(:to="'step'").code-button.color-green done()
</template>

<script>
import steps from '../_steps'
export default {
  name: 'welcome',
  store: [],
  data () {
    return {
      step: steps[this.$route.params.step.split('-')[0]],
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
