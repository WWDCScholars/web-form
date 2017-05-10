<template lang="pug">
transition(name="modal")
  .modal-mask
    .modal-wrapper
      .modal-container

        .modal-header
          slot(name="header") Default Header

        .modal-body
          slot(name="body") Default Body
</template>

<script>
export default {
  name: 'modal',
  store: [],
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {},
  components: {}
}
</script>

<style lang="css">
</style>
