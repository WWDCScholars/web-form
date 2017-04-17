<template lang="pug">
.step-form
  table
    tr(v-for="field in fields")
      td: label() let {{ field.name }} =&nbsp;
      td: input(:type="field.type", :placeholder="field.placeholder")
</template>

<script>
export default {
  name: 'step-form',
  store: [],
  props: ['fields'],
  data () {
    return {
    }
  },
  computed: {},
  mounted() {},
  methods: {},
  components: {}
}
</script>

<style lang="css">
</style>
