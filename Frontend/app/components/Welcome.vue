<template lang="pug">
.container.code
  h2
    span.color-blue print
    span.color-black (
    span.color-red "Hello, Scholars!"
    span.color-black )

  - var batches = ['batch2017', 'batch2016', 'batch2015', 'batch2014', 'batch2013', 'batch2012', 'batchEarlier']
  .code-block.code-huge.color-black
    .code-block.color-purple /* Select Your Batch or Batches */
    .code-split
      .code-split-left addYourselfIn(
      .code-split-right
        span [
        each batch in batches
          .code-checkbox
            input(type='checkbox', name= batch, id= batch)
            label(for= batch, class='color-' + batch)= '.' + batch
            if batch != batches[batches.length -1]
              span ,
        span ])

    router-link(:to="'step'").code-button.color-green done()

  page-footer
</template>

<script>
export default {
  name: 'welcome',
  store: [],
  data () {
    return {

    }
  },
  computed: {},
  mounted() {},
  methods: {},
  components: {
    'page-footer': require('./Footer.vue')
  }
}
</script>

<style lang="css">
</style>
