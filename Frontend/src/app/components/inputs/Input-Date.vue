<template lang="pug">
.form-input.form-date
  input(type="text", v-model="timestamp", :id="field.name").flatpickr
  //- Flatpickr(:options="fpOptions", v-model="timestamp", :id="field.name")
  //- .form-input-date
    //- input(type="number", min="1", max="31", )
  label(:for="field.name", ref="label").form-title {{ field.placeholder }}
</template>

<script>
import moment from 'moment'
export default {
  name: 'input-date',
  props: ['value', 'field'],
  store: [],
  data () {
    return {
      model: this.value,
      timestamp: ''
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    onValueChanged () {
      const label = this.$refs.label
      if (this.timestamp !== '') {
        label.classList.add('no-transition')
        label.classList.add('input-has-value')
        setTimeout(() => {
          label.classList.remove('no-transition')
        }, 200)
      } else {
        label.classList.remove('input-has-value')
      }

      const ts = moment(this.timestamp, 'DD/MM/YYYY').valueOf()
      this.model = ts
      this.$emit('input', ts)
    }
  },
  watch: {
    'timestamp': 'onValueChanged'
  },
  components: {}
}
</script>

<style lang="css">
</style>
