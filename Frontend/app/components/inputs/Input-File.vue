<template lang="pug">
.form-file(v-else-if="field.type === 'file'")
  input(type="file", :name="field.name", @change="onFileInputChange")
  .form-file-icon
  img(src="#", ref="preview").form-file-preview
  button(@click="removeFile").form-file-remove
</template>

<script>
export default {
  name: 'input-file',
  props: [ 'value', 'field'],
  store: [],
  data () {
    return {
      fileValue: ''
    }
  },
  computed: {},
  mounted() {},
  methods: {
    onFileInputChange (event) {
      const input = event.srcElement
      if (input.files && input.files[0]) {
        const $this = this
        const reader = new FileReader()
        const preview = input.nextSibling.nextSibling

        reader.onload = function (e) {
          $this.fileValue = e.target.result
          preview.src = $this.fileValue
          preview.classList.add('show')

          $this.$emit('input', String($this.fileValue))
        }

        reader.readAsDataURL(input.files[0])
      }
    },
    removeFile (event) {
      const preview = this.$reds.preview
      this.fileValue = ''
      preview.src = ''
      preview.classList.remove('show')
      this.$emit('input', '')
    }
  },
  components: {}
}
</script>

<style lang="css">
</style>
