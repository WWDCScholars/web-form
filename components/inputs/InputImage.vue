<template lang="pug">
.input-image
  .image(v-for="(imageModel, i) in model")
    input(
      type="file",
      :name="name",
      :accept="accept",
      @change="onFileInputChanged(i, $event)"
    )
    img(src="~/assets/images/upload-icon.png").upload-icon
    img(
      v-if="previews[i]"
      :src="previews[i]"
    ).preview
    button(
      v-if="previews[i]",
      @click="clearField(i)"
    ).cta-remove

  button(
    v-if="multiple && imageCount < maxCount"
    @click="addField"
  ).cta-add
</template>

<script lang="ts">
import { Component, Model, Prop, Watch, Vue } from 'nuxt-property-decorator';

@Component
export default class InputImage extends Vue {
  @Model('change')
  value: (File | undefined)[]

  @Prop()
  name: string
  @Prop()
  accept: string
  @Prop()
  required: boolean
  @Prop()
  multiple: boolean
  @Prop()
  maxCount: number

  model: (File | undefined)[] = this.value || [undefined]
  value_validate: (File | undefined) = undefined;

  previews: string[] = []

  get imageCount() {
    return this.model.length;
  }

  addField() {
    if (this.imageCount >= (this.maxCount || 0)) {
      return;
    }

    this.$emit('change', [...this.model, undefined]);
  }

  clearField(index) {
    this.$set(this.previews, index, undefined);
    this.model[index] = undefined;
    this.value_validate = undefined;
    this.$emit('change', this.model);
  }

  onFileInputChanged(index, event) {
    const input = event.srcElement || event.target;
    if (!input.files || !input.files[0]) {
      return;
    }

    const file = input.files[0];

    // update preview
    this.updatePreview(index, file);

    // add to model
    this.model[index] = file;
    this.value_validate = file;

    // emit changed model
    this.$emit('change', this.model);
  }

  updatePreview(index, file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.$set(this.previews, index, e.target['result']);
    };
    reader.readAsDataURL(file);
  }

  @Watch('value')
  onValueChanged(val: (File | undefined)[]) {
    this.model = val;
  }
}
</script>

<style lang="sass" scoped>
.input-image
  display: flex
  flex-wrap: wrap
  justify-content: flex-start
  margin-bottom: -15px

  .image
    position: relative
    width: 125px
    height: 125px
    background-color: $white
    border: 1px solid $form-border-color
    border-radius: $border-radius
    cursor: pointer
    margin-right: 15px
    margin-bottom: 15px
    transition: border-color 100ms linear, box-shadow 100ms linear

    input
      width: 100%
      height: 100%
      opacity: 0
      cursor: pointer

    .upload-icon
      display: block
      position: absolute
      top: 50%
      left: 50%
      transform: translateX(-50%) translateY(-50%)
      width: 40px
      height: 40px
      pointer-events: none

    .preview
      position: absolute
      top: 50%
      left: 50%
      width: 95px
      height: 95px
      transform: translateX(-50%) translateY(-50%)
      overflow: hidden
      pointer-events: none
      border: 0
      object-fit: cover

    .cta-remove
      position: absolute
      top: 5px
      right: 5px
      width: 20px
      height: 20px
      border-radius: 10px
      border: 0
      background-color: $sch-red
      padding: 0

      &:after
        content: ' '
        position: absolute
        top: 8px
        left: 4px
        width: 12px
        height: 3px
        border-radius: 1.5px
        background-color: $white

  .cta-add
    width: 125px
    height: 125px
    background-color: $white
    border: 1px solid $form-border-color
    border-radius: $border-radius
    background-image: url("~/assets/images/add-icon.png")
    background-repeat: no-repeat
    background-size: 40px 40px
    background-position: center
    margin-right: 15px
    margin-bottom: 15px
    transition: border-color 100ms linear, box-shadow 100ms linear

.field-image-wide
  .image
    width: 150px
    height: 100px

    .preview
      width: 88px
      height: 70px

    .cta-remove
      right: 20px

  .cta-add
    width: 150px
    height: 100px

+form-colors
  $bg: dyn-temp('bg')
  .input-image
    .image, .cta-add
      &:hover
        border-color: $bg
        box-shadow: 0 0 4px transparentize($bg, 0.6)
</style>
