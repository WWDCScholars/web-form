<template lang="pug">
.form-input.form-date
  Flatpickr(:options="fpOptions", v-model="model")
  label(:for="field.name", ref="label").form-title {{ field.placeholder }}
</template>

<script>
export default {
  name: 'input-date',
  props: ['value', 'field'],
  store: [],
  data () {
    return {
      model: this.value,
      datepicker: null,
      fpOptions: {
        dateFormat: 'd/m/Y'
      }
    }
  },
  computed: {},
  mounted () {},
  methods: {
    onValueChanged () {
      const label = this.$refs.label
      if (this.model != '') {
        label.classList.add('no-transition')
        label.classList.add('input-has-value')
        setTimeout(() => {
          label.classList.remove('no-transition')
        }, 200)
      } else {
        label.classList.remove('input-has-value')
      }
      this.$emit('input', this.model)
    }
  },
  watch: {
    'model': 'onValueChanged'
  },
  components: {}
}
</script>

<style lang="css">
</style>
