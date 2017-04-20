<template lang="pug">
.step-form.form(:class="colorClass")
  h3 {{ step.title }}
  .form-group(v-for="group in step.groups")
    h4 {{ group.title }}
    .form-field(v-for="field in group.fields", :class="field.class")
      // *TYPE radio
      .form-select(v-if="field.type === 'radio'")
        .form-option(v-for="option in field.options")
          input(type="radio", :name="field.name", :value="option", :id="option", :required="field.required", v-model="field.model", @click="evaluateCompletion")
          label(v-bind:for="option") {{ option }}

      // *TYPE file
      .form-file(v-else-if="field.type === 'file')
      //- .form-file(v-else-if="field.type === 'file'")
      //-   vue-clip(:options="options")
      //-     template(slot="clip-uploader-action")
      //-       div
      //-         .dz-message.form-file-placeholder: .form-file-icon
      //-
      //-     template(slot="clip-uploader-body", scope="props")
      //-       div(v-for="file in props.files").form-file-preview
      //-         img(:src="file.dataUrl", :alt="file.name")
      //-         .file-progress
      //-           .file-progress-inner
      //-             .file-progress-circle.file-progress-left
      //-             .file-progress-circle.file-progress-right


      // *TYPE all
      .form-input(v-else-if="field.type === 'text'")
        input(type="text", :name="field.name", :id="field.name", :required="field.required" @focusout="onFocusOut", v-model="field.model", @keyup="evaluateCompletion")
        label(:for="field.name").form-title {{ field.placeholder }}

      .form-comment(v-if="field.comment") {{ field.comment }}

  .form-cta-group
    button(v-if="currentStepNumber != 0", v-on:click="previousStep").form-cta.form-cta-secondary.form-cta-left Previous
    button(v-if="currentStepNumber != stepCount - 1", v-on:click="nextStep").form-cta.form-cta-primary.form-cta-right Continue
    button(v-if="currentStepNumber === stepCount - 1", v-on:click="submit").form-cta.form-cta-primary.form-cta-right Submit
</template>

<script>
export default {
  name: 'step-form',
  store: [],
  props: ['step'],
  data () {
    return {
      options: {
        url: '/asdf',
        paramName: 'file',
        uploadMultiple: false,
        // acceptedFiles: ['image/*']
      }
    }
  },
  computed: {
    colorClass () {
      return 'form-color-' + this.step.color
    },
    currentStepNumber () {
      return this.step.slug.split('-')[0]
    },
    stepCount () {
      return this.$store.steps.length
    }
  },
  mounted() {},
  methods: {
    evaluateCompletion () {
      var completed = true
      for (var g = 0; g < this.step.groups.length; g++) {
        const group = this.step.groups[g]
        for (var f = 0; f < group.fields.length; f++) {
          const field = group.fields[f]
          if (field.required != false) {
            if (!field.model) {
              completed = false
            }
          }
        }
      }

      console.log(completed)
    },
    onFocusOut (event) {
      const src = event.srcElement
      if (src.value != '') {
        src.nextSibling.className = 'form-title input-has-value'
      } else {
        src.nextSibling.className = 'form-title'
      }
    },

    nextStep () {

    },
    previousStep () {

    },
    submit () {

    }
  },
  components: {}
}
</script>

<style lang="css">
</style>
