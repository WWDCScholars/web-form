<template lang="pug">
.container.color-gray
  h2.color-green Welcome to WWDCScholars!
  h3.color-green Are you a Scholarship Winner?
  p.
    First of all - congratulations! Whether you're a first-time winner, or a returning Scholar, you've achieved something special and should be very proud!
  p.
    Now it's time you showcase your talent and connect with the other winners you will be spending the week with in California!


  hr

  step-form(:step="step")
</template>

<script>
export default {
  name: 'welcome',
  store: ['wwdcs', 'steps'],
  data () {
    return {
      step: this.$store.steps[0]
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

//- .form.form-fluid
//-   .form-checkbox(v-for="wwdc in wwdcs")
//-     input(type="checkbox", name="attended", :value="wwdc", :id="wwdc")
//-     label(:for="wwdc") {{ wwdc }}
