<template lang="pug">
.content-wrapper
  h2.color-blue Unfortunately there was a problem...
  h4 {{ error.message }}

  p(v-if="error.statusCode !== 404") Please try again later. If the problem remains, contact us at #[a(href="mailto:team@wwdcscholars.com") team@wwdcscholars.com].

  p(v-if="error.statusCode === 404").form-color-blue
    nuxt-link(to="/").btn.btn-primary Back to Home
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import PageHeader from '~/components/PageHeader.vue';

@Component({
  components: { PageHeader },
  middleware: []
} as any)
export default class LayoutError extends Vue {
  @Prop()
  error
}
</script>

<style lang="sass" scoped>
.content-wrapper
  h4
    text-align: center

  p
    margin-top: 50px
    text-align: center

    .btn
      text-transform: none
</style>
