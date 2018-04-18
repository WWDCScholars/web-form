<template lang="pug">
.spinner
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class Spinner extends Vue {
}
</script>

<style lang="sass" scoped>
.spinner
  font-size: 10px
  margin: 50px auto
  text-indent: -9999em
  width: 11em
  height: 11em
  border-radius: 50%
  background: $sch-gray
  background: linear-gradient(to right, $sch-gray 10%, transparentize($sch-gray, 1.0) 42%)
  position: relative
  animation: load3 1.4s infinite linear
  transform: translateZ(0)

  &:before
    content: ''
    position: absolute
    width: 50%
    height: 50%
    background-color: $white
    border-radius: 100% 0 0 0
    top: 0
    left: 0

  &:after
    position: absolute
    content: ''
    width: 75%
    height: 75%
    background-color: $white
    border-radius: 50%
    margin: auto
    top: 0
    left: 0
    bottom: 0
    right: 0

+form-colors
  $bg: dyn-temp('bg')
  .spinner
    background: $bg
    background: linear-gradient(to right, $bg 10%, transparentize($bg, 1.0) 42%)

@keyframes load3
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)
</style>
