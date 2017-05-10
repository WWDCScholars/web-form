<template lang="pug">
.form-file-wrapper
  .form-file(ref="files", v-for="fileModel in model")
    input(type="file", :name="field.name", @change="onFileInputChange", :accept="field.accept")
    .form-file-icon
    img(src="", ref="preview").form-file-preview
    button(@click="removeFile").form-file-remove

  button(v-if="field.multiple && fileCount < field.max", @click="fileAdd").form-file-add
</template>

<script>
export default {
  name: 'input-file',
  props: ['value', 'field'],
  store: [],
  data () {
    return {
      model: this.value
    }
  },
  computed: {
    fileCount () {
      return this.model.length
    }
  },
  mounted () {
    for (var m = 0; m < this.model.length; m++) {
      const fm = this.model[m]
      if (fm) {
        const el = this.getFileElement(m)
        const preview = el.children[2]
        this.displayPreview(fm, preview)
      }
    }
  },
  methods: {
    fileAdd () {
      if (this.fileCount >= this.field.max) {
        return
      }

      this.model.push('')
    },
    getFileIndex (el) {
      return this.$refs.files.indexOf(el)
    },
    getFileElement (index) {
      return this.$refs.files[index]
    },
    displayPreview (file, previewElement) {
      const reader = new FileReader()

      reader.onload = function (e) {
        const value = e.target.result
        previewElement.src = value
        previewElement.classList.add('show')
      }

      reader.readAsDataURL(file)
    },
    onFileInputChange (event) {
      const input = event.srcElement || event.target
      if (input.files && input.files[0]) {
        const file = input.files[0]
        const preview = input.nextSibling.nextSibling
        this.displayPreview(file, preview)

        const index = this.getFileIndex(input.parentElement)
        this.model[index] = file

        this.$emit('input', this.model)
      }
    },
    removeFile (event) {
      const parent = event.srcElement.parentElement
      const index = this.getFileIndex(parent)
      const preview = parent.children[2]
      this.model[index] = {}
      preview.src = ''
      preview.classList.remove('show')
      this.$emit('input', this.model)
    }
  },
  components: {}
}
</script>

<style lang="css">
</style>
