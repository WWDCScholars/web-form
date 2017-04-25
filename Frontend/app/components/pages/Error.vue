<template lang="pug">
.container.container-outer.color-gray
  h2.color-blue Unfortunately there was an error...
  p.
    Please try again later. If this problem remains, contact us at #[a(href="mailto:team@wwdcscholars.com") team@wwdcscholars.com]
</template>

<script>
import Raven from 'raven-js'
export default {
  name: 'error',
  store: [],
  data () {
    return {}
  },
  computed: {},
  mounted() {
    Raven.showReportDialog()
  },
  methods: {},
  components: {}
}
</script>

<style lang="css">
</style>
