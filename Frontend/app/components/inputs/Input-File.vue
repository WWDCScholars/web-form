<template lang="pug">
.form-file-wrapper
  .form-file(ref="files", v-for="fileModel in model")
    input(type="file", :name="field.name", @change="onFileInputChange")
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
  mounted() {
    for (var m = 0; m < this.model.length; m++) {
      const fm = this.model[m]
      if (fm) {
        const el = this.getFileElement(m)
        const preview = el.children[2]
        preview.src = fm
        preview.classList.add('show')
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
    onFileInputChange (event) {
      const input = event.srcElement
      if (input.files && input.files[0]) {
        const self = this
        const reader = new FileReader()
        const preview = input.nextSibling.nextSibling

        reader.onload = function (e) {
          const index = self.getFileIndex(input.parentElement)
          const val = e.target.result
          self.model[index] = val
          preview.src = val
          preview.classList.add('show')

          self.$emit('input', self.model)
        }

        reader.readAsDataURL(input.files[0])
      }
    },
    removeFile (event) {
      const parent = event.srcElement.parentElement
      const index = this.getFileIndex(parent)
      const preview = parent.children[2]
      this.model[index] = ''
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
