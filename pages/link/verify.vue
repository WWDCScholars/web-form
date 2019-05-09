<template lang="pug">
.link-step.link-step-1
  p.
    We sent an email to the address you specified. Please follow the instructions in that email to link your existing profile to your iCloud account. If you can't find the email in your inbox, please check your spam folder.
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class PageLinkVerify extends Vue {}
</script>

<style lang="sass" scoped></style>
