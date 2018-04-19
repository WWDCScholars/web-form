<template lang="pug">
transition(name="modal")
  .modal-mask
    .container
      h3.title:  slot
      spinner
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import Spinner from './Spinner.vue';

@Component({
  components: { Spinner }
})
export default class ModalSpinner extends Vue {
}
</script>

<style lang="sass" scoped>
.modal-mask
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  z-index: 9998
  background-color: rgba(0, 0, 0, 0.5)
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
  transition: background-color 200ms linear
  padding: 15px

  .container
    padding: 20px 30px
    background-color: $white
    border-radius: $border-radius
    border: 1px solid $form-border-color
    transition: transform 200ms ease
    transform: scale(1)

    +for-tablet-landscape-up
      width: 500px

    .title
      text-align: center
      margin-top: 30px

+form-colors
  $bg: dyn-temp('bg')
  .modal-mask
    color: $bg
</style>

<style lang="sass">

.modal-enter.modal-mask,
.modal-leave-active.modal-mask
  background-color: rgba(0, 0, 0, 0.0)

  .container
    transform: scale(1.1)
</style>
