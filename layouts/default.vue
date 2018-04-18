<template lang="pug">
.page
  page-header
  .content-wrapper
    nuxt
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import PageHeader from '~/components/PageHeader.vue';

@Component({
  components: {
    PageHeader
  }
})
export default class LayoutDefault extends Vue {
}
</script>

<style lang="sass" scoped>
.page
  padding-bottom: 80px
</style>
