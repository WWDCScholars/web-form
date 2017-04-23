<template lang="pug">
.container.container-outer.color-gray
  h2.color-blue Welcome to WWDCScholars!
  h3.color-blue Are you a 2017 Scholarship Winner?
  p.
    First of all - congratulations! Whether you're a first-time winner, or a returning Scholar, you've achieved something special and should be very proud!
  p.
    Now it's time you showcase your talent and connect with the other winners you will be spending the week with in San Jose!


  hr

  step-form(:step="step")
</template>

<script>
export default {
  name: 'welcome',
  store: ['steps'],
  data () {
    return {
      step: this.$store.steps[0]
    }
  },
  computed: {},
  mounted() {},
  methods: {},
  components: {
    'step-form': require('../Step-Form.vue')
  }
}
</script>

<style lang="css">
</style>
